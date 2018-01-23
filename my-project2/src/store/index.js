import Vue from 'vue'
import Vuex from 'vuex'
import * as firebase from 'firebase'

Vue.use(Vuex)

export const store = new Vuex.Store({
	//locally stored states will be available for users who are not signed in to see.
	state:{
		loadedNews: [
			{
				imageUrl: 'static/images/chicken_in_space.jpg', 
				id: 'q8usbbhjki',
				headline: 'Welcome to the Units are in Chickens',
				i: 0
			},
			{
				imageUrl: 'static/images/system_dynamics_chicken.jpg', 
				id: 'qidncghgfe', 
				headline: 'Contribute a design and become a partner',
				i: 1
			},
			{
				imageUrl: 'static/images/chick_final.png',
				id: '78ujgdqppn',
				headline: 'Where can you take the chicken',
				i: 2
			},
		],
		loadedDesigns: [
			{
				firstName: 'Matt',
				lastName: 'Shipman',
				title: 'System Dynamics', 
				imageUrl: 'static/images/system_dynamics_chicken.jpg',
				description: "dafasdfasd fas df as df as df as lkasjdlvfa sdkjfsadkjf; lksjadlkfj;lksa dfl sa df klsajdlkf jlksa dfkl sal; kdfj; lkaslj; df;lk saldkf laks kd jf;lask j;fd;lk asl; dfl ;sakj df;masdkfj asdkf jsafsadkfjlkasj;dlkfjlkas jdf kasl; kjdf;ljk as;lk dfjl; asdf;l",  
				date: "",
				vote: "",
				votes: "3",
			},
			{
				firstName: 'Matt',
				lastName: 'Shipman',
				title: 'System Dynamics', 
				imageUrl: 'static/images/system_dynamics_chicken.jpg',
				description: "dafasdfasd fas df as df as df as lkasjdlvfa sdkjfsadkjf; lksjadlkfj;lksa dfl sa df klsajdlkf jlksa dfkl sal; kdfj; lkaslj; df;lk saldkf laks kd jf;lask j;fd;lk asl; dfl ;sakj df;masdkfj asdkf jsafsadkfjlkasj;dlkfjlkas jdf kasl; kjdf;ljk as;lk dfjl; asdf;l",  
				date: "",
				vote: "",
				votes: "3",
			},
			{
				firstName: 'Matt',
				lastName: 'Shipman',
				title: 'System Dynamics', 
				imageUrl: 'static/images/system_dynamics_chicken.jpg',
				description: "dafasdfasd fas df as df as df as lkasjdlvfa sdkjfsadkjf; lksjadlkfj;lksa dfl sa df klsajdlkf jlksa dfkl sal; kdfj; lkaslj; df;lk saldkf laks kd jf;lask j;fd;lk asl; dfl ;sakj df;masdkfj asdkf jsafsadkfjlkasj;dlkfjlkas jdf kasl; kjdf;ljk as;lk dfjl; asdf;l",  
				date: "sdf",
				vote: "",
				votes: "3", 
			},
		],
		user: null,
		loading: false, 
		error: null,
    croppedImageUrl: '',
	},
	mutations:{
		//Log comment to user state
		addComment (state, payload) {
			if(state.user.comments){
					state.user.comments.push({
						comment: payload.comment, 
						designId: payload.designId,
						id: payload.id
					})
			} else {
				state.user.comments = [{
						comment: payload.comment, 
						designId: payload.designId,
						id: payload.id
				}]
			}
			// log comment to design state
			
			console.log(payload.designId)
			let targetDesign = state.loadedDesigns.find((design) => {
				return design.id === payload.designId
			})
			targetDesign.comments.push({
				comment: payload.comment, 
				userId: payload.userId, 
				userName: payload.userName,
				id: payload.id,
				designId: payload.designId
			})
		},
	
		userDesignFeedback (state, payload){
			state.user.userVotes[payload.designId] = payload.feedback
		},
		
		setLoadedDesigns (state, payload) {
			state.loadedDesigns = payload
		},
		createDesign (state, payload) {
			state.loadedDesigns.push(payload)
			state.user.designSubmissions.push({
				title: payload.title,
				description: payload.description, 
				date: payload.date, 
				imageUrl: payload.imageUrl,
				})
		},
		createModification (state, payload){	
			console.log(payload)
			let parentDesign = state.loadedDesigns.find((design) => {
					return design.id === payload.parentId
				})
			console.log(parentDesign)
			parentDesign.modifications.push(payload)
		},
		
		updateDesign (state, payload) {
				const design = state.loadedDesigns.find(design => {
						return design.id === payload.id
				})
				if (payload.firstName){
						design.firstName = payload.firstName
				}
				if (payload.lastName){
						design.lastName = payload.lastName
				}
				if (payload.titleName){
						design.title = payload.title
				}
				if (payload.description){
						design.description = payload.description           
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
		addComment ({commit, getters}, payload){
			let user = getters.user
			const comment = {
				comment: payload.comment,
				userId: user.id,
				userName: user.userName
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
						userId: user.id,
						userName: user.userName,
						id: key,
						designId: payload.designId 
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
						let mods = []
						let comments = []
						for (let comment in obj[key].comments){
							comments.push({
								id: comment,
								comment: obj[key].comments[comment].comment,
								userId: obj[key].comments[comment].userId,
								userName: obj[key].comments[comment].userName
							})
						}
						for (let mod in obj[key].modifications){
							mods.push({
								id: mod,
								firstName: obj[key].modifications[mod].firstName,
								lastName: obj[key].modifications[mod].lastName,
								imageUrl: obj[key].modifications[mod].imageUrl,
								date: obj[key].modifications[mod].date,
								creatorId: obj[key].modifications[mod].creatorId,
								parentId: obj[key].modifications[mod].parentId,
								imageUrl: obj[key].modifications[mod].imageUrl, 
							})	
						}
						designs.push({
							id:key, 
							firstName: obj[key].firstName,
							lastName: obj[key].lastName,
							title: obj[key].title,
							imageUrl: obj[key].imageUrl,
							description: obj[key].description,
							date: obj[key].date,
							creatorId: obj[key].creatorId,
							comments: comments,
							modifications: mods
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
				const feedback = {
				designId: payload.designId, 
				feedback: payload.feedback
			}
			firebase.database().ref('/users/' + userId + '/designFeedback').update({[payload.designId]: payload.feedback})
			commit('userDesignFeedback', feedback)
		},
	
		createDesign ({commit, getters}, payload){
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
				firstName: payload.firstName, 
				lastName: payload.lastName,
				creatorId: userId,
				modifications: [], 
				comments: []
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
		
	createModification({commit, getters}, payload){
			let userId = getters.user.id
			const modification = {
				firstName: payload.firstName, 
				lastName: payload.lastName,
				title: payload.title,
				description: payload.description,
				date: payload.date.toISOString(),
				creatorId: getters.user.id,
				parentId: payload.parentId,
				imageUrl: payload.imageUrl,
				comments: []
			}
			//reaach out to fire base
			let imageUrl
			let key
			firebase.database().ref('designs/' + payload.parentId + '/modifications').push(modification)
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
					firebase.database().ref('/users/' + userId + '/designSubmissions').push(modification)
				})
				.then(() => {
					commit('createModification', {
						...modification, 
						id: key
					})
				})
				.catch((error) => {
					console.log(error)
				})
		},
		
		updateDesignData({commit}, payload) {
				commit('setLoading', true)
				const updateObj = {}
				if (payload.firstName){
						updateObj.firstName = payload.firstName
				}
				if (payload.lastName){
						updateObj.lastName = payload.lastName
				}
				if (payload.title){
						updateObj.title = payload.title
				}
				if (payload.description){
						updateObj.description = payload.description           
				}
				firebase.database().ref('designs').child(payload.id).update(updateObj).then(() => {
						commit('setLoading', false)
						commit('updateDesign', payload)
				})
				.catch(error => {
						console.log("error")
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
						for(let submission in data.val().designSubmissions){
							designSubmissions.push({
								id: submission,
								title: submission.title,
								description: submission.description,
								date: submission.date,//.toISOString(),
								imageUrl: submission.imageUrl,
							})
						}
						for(let comment in data.val().comments){
							comments.push({
								id: comment,
								comment: comment.comment,
								designId: comment.designId,
							})
						}
						const updatedUser = {
							id: userId,
							userName: data.val().userName,
							email: data.val().email,
							designSubmissions: designSubmissions,
							userVotes: data.val().designFeedback,
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
						let mods = []
						for (let mod in obj[key].modifications){
							mods.push({
								id: mod,
								firstName: obj[key].modifications[mod].firstName,
								lastName: obj[key].modifications[mod].lastName,
								imageUrl: obj[key].modifications[mod].imageUrl,
								date: obj[key].modifications[mod].date,
								creatorId: obj[key].modifications[mod].creatorId,
								parentId: obj[key].modifications[mod].parentId,
								imageUrl: obj[key].modifications[mod].imageUrl,
								comments: obj[key].modifications[mod].comments
							})	
						}
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
							modifications: mods
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
			return getters.loadedNews.slice(0,2)
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
		//userVote (state, getters) {
		//	const user = getters.user
		//	return user.userVotes.payload
		//},
		userVote (state){
			return (designId) => {
				console.log('entered')
				try{
					return state.user.userVotes[designId]
				}
				catch(error){
					console.log(error)
					return ""
				}
			}
		},
	}
})