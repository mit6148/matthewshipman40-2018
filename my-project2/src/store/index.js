import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
	//locally stored states will be available for users who are not signed in to see.
	state:{
		loadedNews: [
			{
				imageUrl: 'static/images/Code-Quality.png', 
				id: 'q8usbbhwqoepcnjki',
				i: 0
			},
			{
				imageUrl: 'static/images/shit-just-got-real.jpeg', 
				id: 'qidncghgthbcfe', 
				i: 1
			},
			{
				imageUrl: 'static/images/identity-theft.jpg',
				id: '78ujgdqpprwegwegn',
				i: 2
			},
			{
				imageUrl: 'static/images/MIT.png',
				id: 'cwjencopwneppuobbd',
				i: 3
			},
		],
		loadedDesigns: [],
		user: null,
		loading: false, 
		error: null,
    croppedImageUrl: '',
	},
	mutations:{
		deleteDesign (state,payload) {
			let userId = state.user.id
			//remove from user state
			let userSubmissions = state.user.designSubmissions
			userSubmissions.splice(userSubmissions.indexOf(payload), 1)
			let loadedDesigns = state.loadedDesigns
			let matchedDesign = loadedDesigns.find((design) => {
				return design.id === payload.id
			})
			let userComments = state.user.comments
			let designComments = matchedDesign.comments
			//erase associated comments in user state
			for(let comment in designComments){
				if(designComments[comment].creatorId == userId){
					let userComment = state.user.comments.find((userComment) => {
						return userComment.id === designComments[comment].id
					})
				userComments.splice(userComments.indexOf(userComment), 1)
				}
			}
			//remove from loaded design state
			loadedDesigns.splice(loadedDesigns.indexOf(matchedDesign), 1)
			
			
		},
		deleteComment (state,payload) {
			//remove comment from user state
			let userComments = state.user.comments
			userComments.splice(userComments.indexOf(payload), 1)
			//remove comment from loaded design state
			let loadedDesigns = state.loadedDesigns
			let matchedDesign = loadedDesigns.find((design) => {
				return design.id === payload.designId
			})
			let matchedComment = matchedDesign.comments.find((comment) => {
				return comment.id === payload.id
			})
			matchedDesign.comments.splice(matchedDesign.comments.indexOf(matchedComment),1)
		},
		
		updateComment (state, payload) {
			let design = state.loadedDesigns.find((design) => {
				return design.id === payload.designId
			})
			let matchedComment = design.comments.find((comment) => {
					return comment.id === payload.id
			})
			let userComment = state.user.comments.find((comment) => {
				return comment.id === payload.id
			})
			if (payload.comment){
					matchedComment.comment = payload.comment
					userComment.comment = payload.comment
			}
		},
		
		addComment (state, payload) {
			if(state.user.comments){
					state.user.comments.push(payload)
			} else {
				state.user.comments = [payload]
			}
			// log comment to design state
			
			let targetDesign = state.loadedDesigns.find((design) => {
				return design.id === payload.designId
			})
			targetDesign.comments.push(payload)
		},
	
		userDesignFeedback (state, payload){
			let userVote = state.user.userVotes.find((userVote) => {
				return userVote.id === payload.id
			})
			let targetDesign = state.loadedDesigns.find((design) => {
				return design.id === payload.id
			})
			targetDesign.votes = payload.votes
			
			if (userVote == undefined || userVote == null) {
				state.user.userVotes.push(payload)
			} else {
				userVote.vote = payload.vote
			}
		},
		
		setLoadedDesigns (state, payload) {
			state.loadedDesigns = payload
		},
		createDesign (state, payload) {
			console.log(payload)
			state.loadedDesigns.push(payload)
			state.user.designSubmissions.push({
				title: payload.title,
				description: payload.description, 
				date: payload.date, 
				imageUrl: payload.imageUrl,
				id: payload.id,
				})
		},
		
		updateDesign (state, payload) {
				let design = state.loadedDesigns.find(design => {
						return design.id === payload.id
				})
				let userDesign = state.user.designSubmissions.find((userDesign) => {
					return userDesign.id === payload.id
				})
				if (payload.title){
						design.title = payload.title
						userDesign.title = payload.title
				}
				if (payload.description){
						design.description = payload.description    
						userDesign.description = payload.description
				}
				
		},
        
		setUser(state,payload) {
			state.user = payload
		},
		setLoading(state,payload) {
			state.loading = payload
		},
		setError(state, payload) {
			state.error = payload
		},
		clearError(state, payload){
			state.error = null
		},
		cropImage(state, payload){
				state.croppedImageUrl = payload
		},
	},  
	
	actions:{
		deleteDesign ({commit, getters}, payload){
			let user = getters.user
			console.log(payload)
			firebase.database().ref('/designs/' + payload.id).once('value').then((data) => {
				console.log(data.val().comments)
				for(let commentId in data.val().comments){
					let creatorId = data.val().comments[commentId].creatorId
					firebase.database().ref('users/' + creatorId + '/comments').update({[commentId]: null})
				}	
			}).then(() =>{
				firebase.database().ref('designs/').update({[payload.id]: null})
			})
			firebase.database().ref('users/' + user.id + "/designSubmissions").update({[payload.id]: null})
			commit('deleteDesign', payload)
		},
		
		deleteComment ({commit, getters}, payload){
			let user = getters.user
			firebase.database().ref('designs/' + payload.designId + '/comments').update({[payload.id]: null})	
			firebase.database().ref('users/' + user.id + "/comments").update({[payload.id]: null})
			commit('deleteComment', payload)
		},
		
		addComment ({commit, getters}, payload){
			let user = getters.user
			const comment = {
				comment: payload.comment,
				creatorId: user.id, 
				creatorName: user.userName
			} 
			firebase.database().ref('designs/' + payload.designId + '/comments/').push(comment)
			.then((data) => {
					let key = data.key
					return key
				})
				.then(key => {
					firebase.database().ref('/users/' + user.id + '/comments/').update({[key]:{comment: payload.comment, designId: payload.designId}})
					return key
				})
				.then((key) => {
					commit('addComment', {
						comment: payload.comment, 
						creatorId: user.id,
						creatorName: user.userName,
						id: key,
						designId: payload.designId,
					})
				})
				.catch((error) => {
					console.log(error)
				})
		},
		
		cropImage ({commit}, payload){
				commit('cropImage', payload)    
		},

		loadDesigns ({commit}) {
			commit('setLoading', true)
			firebase.database().ref('designs').once('value')
				.then((data) => {
					const designs = []
					const obj = data.val()
					for (let key in obj) {
						let comments = []
						for (let comment in obj[key].comments){
							comments.push({
								id: comment,
								comment: obj[key].comments[comment].comment,
								creatorId: obj[key].comments[comment].creatorId,
								creatorName: obj[key].comments[comment].creatorName
							})
						}
						designs.push({
							id:key, 
							creatorName: obj[key].creatorName, 
							title: obj[key].title,
							imageUrl: obj[key].imageUrl,
							description: obj[key].description,
							date: obj[key].date,
							creatorId: obj[key].creatorId,
							votes: obj[key].votes,
							comments: comments,
						})
					}
					commit('setLoadedDesigns', designs)
					commit('setLoading', false)
				})
				.catch(
        	(error) => {
        		console.log(error)
        		commit('setLoading', false)
        	}
				)
		},
		
		onFeedback({commit, getters}, payload){
			let userId = getters.user.id
			firebase.database().ref('/users/' + userId + '/designFeedback').update({[payload.designId]: payload.feedback})
			firebase.database().ref('/designs/' + payload.designId + '/votes/').once('value').then((data) => {
				let votes = data.val() + payload.scoreChange
				let feedback = {
					id: payload.designId, 
					vote: payload.feedback,
					votes: votes
				}
				firebase.database().ref('/designs/' + payload.designId).update({votes: votes})
				commit('userDesignFeedback', feedback)
			})
		},
	
		createDesign ({commit, getters}, payload){
			let userName = getters.user.userName
			let userId = getters.user.id
			let userData = {
				title: payload.title,
				description: payload.description,
				date: payload.date.toISOString(),
				imageUrl: payload.imageUrl,
			}
			let design = {
				title: payload.title,
				description: payload.description,
				date: payload.date.toISOString(),
				imageUrl: payload.imageUrl,
				creatorName: userName,
				creatorId: userId,
				comments: [],
				votes: 0
			}
			//reaach out to fire base
			let imageUrl
			let key
			firebase.database().ref('designs').push(design)
				.then((data) => {
					key = data.key
					return key
				})
				.then(key => {
					const filename = payload.image.name
					const ext = filename.slice(filename.lastIndexOf('.'))
					return firebase.storage().ref('designs/' + key + '.' + ext).put(payload.image)
				})
				.then(() => {
					firebase.database().ref('/users/' + userId + '/designSubmissions/').update({[key]:userData})
				})
				.then(() => {
					commit('createDesign', {
						... design, 
						id: key,
					})
				})
				.catch((error) => {
					console.log(error)
				})
			
		},
		
		updateDesignData({commit, getters}, payload) {
				let userId = getters.user.id
				commit('setLoading', true)
				const updateObj = {}
				if (payload.title){
						updateObj.title = payload.title
				}
				if (payload.description){
						updateObj.description = payload.description           
				}
				firebase.database().ref('/users/' + userId + "/designSubmissions/" + payload.id).update(updateObj)
				firebase.database().ref('/designs/' + payload.id).update(updateObj).then(() => {
						commit('setLoading', false)
						commit('updateDesign', payload)
				})
				.catch(error => {
						console.log(error)
						commit("setLoading", false)
				})
		},
		
		updateComment({commit, getters}, payload) {
			let userId = getters.user.id
			const updateObj = {}
				if (payload.comment){
						updateObj.comment = payload.comment
				}
				firebase.database().ref('/users/' + userId + "/comments/" + payload.id).update(updateObj)
				firebase.database().ref('/designs/' + payload.designId + "/comments/" + payload.id).update(updateObj).then(() => {
						commit('setLoading', false)
						commit('updateComment', payload)
				})
				.catch(error => {
						console.log(error)
						commit("setLoading", false)
				})
		},
		
		signUserUp ({commit}, payload) {
			commit('setLoading', true)
			commit('clearError')
			return new Promise((resolve, reject) => {
				firebase.auth().createUserWithEmailAndPassword(payload.email, payload.password)
					.then(
						user => {
							commit('setLoading', false)
							const newUser = {
								id: user.uid,
								userName: payload.userName,
								email: payload.email,
								designSubmissions: [],
								userVotes: [],
								comments: []
							}
							commit('setUser', newUser)
							firebase.database().ref('users/' + user.uid).update({
								userName: payload.userName,
								email: payload.email,
								designSubmissions: [],
								userVotes: [],
								comments: []
							})
							.then(    //just added***
								resolve()
							)
						}
					)
					.catch(
						error => {
							commit('setLoading', false)
							commit('setError', error)
							console.log(error)
						}
					)
			})
		},
		
		signUserIn  ({commit}, payload) {
			commit('setLoading', true)
			commit('clearError')
			return new Promise((resolve, reject) => {
				firebase.auth().signInWithEmailAndPassword(payload.email, payload.password)
					.then(
						user => {
							commit('setLoading', false)
							const newUser = {
								id: user.uid,
								email: payload.email,
								userName: '',
								designSubmissions: [],
								userVotes: [],
								comments: []
							}
							commit('setUser', newUser)
							resolve()
						}
					)
					.catch(
						error => {
							commit('setLoading', false)
							commit('setError', error)
							console.log(error)
						}
					)
			})									 
		},

		autoSignIn ({commit}, payload) {
			return new Promise ((resolve, reject) => {	
				let data = {
					id: payload.uid,
					email: payload.email,
					userName: '',
					designSubmissions: [],
					userVotes: [],
					comments: []
				}
				commit('setUser', data)
				resolve()
			})
		},
		
		fetchUserData({commit, getters}) {
			commit('setLoading', true)
			return new Promise ((resolve, reject) => {
				firebase.database().ref('/users/' + getters.user.id).once('value')
				.then(data => {
					let userId = getters.user.id
					if(data.val() !== null){
						let designSubmissions = []
						let comments = []
						let userVotes = []
						for(let submission in data.val().designSubmissions){
							designSubmissions.push({
								id: submission,
								title: data.val().designSubmissions[submission].title,
								description: data.val().designSubmissions[submission].description,
								date: data.val().designSubmissions[submission].date,//.toISOString(),
								imageUrl: data.val().designSubmissions[submission].imageUrl,
							})
						}
						for(let comment in data.val().comments){
							comments.push({
								id: comment,
								comment: data.val().comments[comment].comment,
								designId: data.val().comments[comment].designId,
							})
						}
						for(let feedback in data.val().designFeedback){
							userVotes.push({
								id: feedback,
								vote: data.val().designFeedback[feedback]
							})
						}
						const updatedUser = {
							id: userId,
							userName: data.val().userName,
							email: data.val().email,
							designSubmissions: designSubmissions,
							userVotes: userVotes,
							comments: comments
						}
						commit('setLoading', false)
						commit('setUser', updatedUser)
						resolve()
					}
				})
				.catch(error =>{
					console.log(error)
					commit('setLoading', false)
				})
			}) //New Line
		},
		
		logout({commit}) {
			firebase.auth().signOut()
			commit('setUser', null)
		},

		clearError ({commit}) {
			commit('clearError')
		},
    setLoading({commit},payload) {
      commit('setLoading', payload)
      console.log("set loading: " + payload)
    },
	},
	
	loadDesigns ({commit}) {
			commit('setLoading', true)
			firebase.database().ref('designs').once('value')
				.then((data) => {
					const designs = []
					const obj = data.val()
					for (let key in obj) {
						designs.push({
							id:key, 
							firstName: obj[key].firstName,
							lastName: obj[key].lastName,
							title: obj[key].title,
							imageUrl: obj[key].imageUrl,
							description: obj[key].description,
							date: obj[key].date,
							creatorId: obj[key].creatorId,
							comments: obj[key].comments,
						})
					}
					commit('setLoadedDesigns', designs)
					commit('setLoading', false)
				})
				.catch(
        	(error) => {
        		console.log(error)
        		commit('setLoading', false)
        	}
				)
		},
	
	getters:{
		loadedNews (state) {
			return state.loadedNews.sort((articleA, articleB) => {
				return articleA.i > articleB.i
			})
		},
		featuredNews (state, getters) {
			return getters.loadedNews.slice(0,4)
		},
		loadedDesigns (state) {
			return state.loadedDesigns.sort((designA, designB) => {
				return designA.id > designB.id
			})
		},
			
		loadedDesign (state){
			return (designId) => {
				return state.loadedDesigns.find((design) => {
					return design.id === designId 
				})
			}
		}, 

		featuredDesigns (state, getters) {
			return getters.loadedDesigns.slice(0,8)
		},
		user (state) {
			return state.user
		},
		loading (state) {
		  return state.loading  
		},
		error (state) {
			return state.error
		},
		croppedImageUrl (state) {
				return state.croppedImageUrl
		},
		userVote (state){
			return (designId) => {
				let userVote = state.user.userVotes.find((userVote) => {
					return userVote.id === designId 
				})
				
				if (userVote == undefined || userVote == null) {
					return ''
				} else {
					return userVote.vote
				}
					
			
			}
		}
	}
})