import { toast } from "react-toastify";
import { cookies } from "../common/Utility.jsx";

// export const baseURL = 'http://localhost:8080';
export const baseURL = 'https://myceph-cephalometric.onrender.com';
console.log("🚀 ~ file: getAPI.jsx:6 ~ baseURL:", process.env.BASE_URL_SERVER)

export function postToServer(url, bodyObject) {
	return new Promise((resolve, reject) =>
    fetch(baseURL + url, {
			method: 'post',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin',
			body: JSON.stringify(bodyObject),
		})
			.then((response) => {
				if(response.status===429) response.text().then(json=>toast.error(json));
				if (response.status === 419) {
					window.location.reload();
				}else if (response.status === 200) {
						response.json().then(json => resolve(json));
				}else response.json().then(json => reject(json));
			})
			.catch((err) => reject(err)),
	);
}

export function getToServer(url) {
	return new Promise((resolve, reject) =>
    fetch(baseURL + url, {
			method: 'get',
			headers: { 'Content-Type': 'application/json' },
			credentials: 'same-origin'
		})
			.then((response) => {
				if(response.status===429) response.text().then(json=>toast.error(json));
				if (response.status === 419) {
					window.location.reload();
				}else if (response.status === 200) {
						response.json().then(json => resolve(json));
				}else response.json().then(json => reject(json));
			})
			.catch((err) => reject(err)),
	);
}

export function postToServerWithToken(url, bodyObject) {
	return new Promise(async (resolve, reject) => {
    const token = await cookies.get('accessToken');
		// const privateKey = await readPEMFile(__dirname, 'rsaPrivateKey.pem');
		// console.log("🚀 ~ file: getAPI.jsx:31 ~ returnnewPromise ~ privateKey:", privateKey)
		// const keyPrivateToken = new NodeRSA(privateKey);
    fetch(baseURL + url, {
			method: 'post',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}`},
			credentials: 'same-origin',
			body: JSON.stringify(bodyObject)
		})
			.then((response) => {
				if(response.status===429) response.text().then(json=>toast.error(json));
				if (response.status === 419) {
					window.location.reload();
				}
				if (response.status === 200) {
					response.json().then(json => resolve(json));
				}else{
					response.json().then(json => reject(json));
				} 
			})
			.catch((err) => reject(err))
	  }
	)
}

export function putToServerWithToken(url, bodyObject) {
	return new Promise(async (resolve, reject) => {
    const token = await cookies.get('accessToken');
		// const privateKey = await readPEMFile(__dirname, 'rsaPrivateKey.pem');
		// const keyPrivateToken = new NodeRSA(privateKey);
    fetch(baseURL + url, {
			method: 'put',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}`},
			credentials: 'same-origin',
			body: JSON.stringify(bodyObject)
		})
			.then((response) => {
				if(response.status===429) response.text().then(json=>toast.error(json));
				if (response.status === 419) {
					window.location.reload();
				}
				if (response.status === 200) {
						response.json().then(json => resolve(json));
				} else response.json().then(json => reject(json));
			})
			.catch((err) => reject(err))
	  }
	)
}

export function getToServerWithToken(url) {
	return new Promise(async (resolve, reject) => {
    const token = await cookies.get('accessToken');
		// const privateKey = await readPEMFile(__dirname, 'rsaPrivateKey.pem');
		// const keyPrivateToken = new NodeRSA(privateKey);
    fetch(baseURL + url, {
			method: 'get',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}`},
			credentials: 'same-origin'
		})
			.then((response) => {
				if(response.status===429) response.text().then(json=>toast.error(json));
				if(response.status === 404){
					response.text().then(text => reject(text));
				}else if(response.status === 419) {
					window.location.reload();
				}else if (response.status === 200) {
						response.json().then(json => resolve(json));
				}else response.json().then(json => reject(json));
			})
			.catch((err) => reject(err))
    });
}


export function deleteToServerWithToken(url) {
	return new Promise(async (resolve, reject) => {
    const token = await cookies.get('accessToken');
    fetch(baseURL + url, {
			method: 'delete',
			headers: { 'Content-Type': 'application/json', token: `Bearer ${token}`},
			credentials: 'same-origin'
		})
			.then((response) => {
				if(response.status===429) response.text().then(json=>toast.error(json));
				if (response.status === 419) {
					window.location.reload();
				}
				if (response.status === 200) {
						response.json().then(json => resolve(json));
				} else response.json().then(json => reject(json));
			})
			.catch((err) => reject(err))
    }
	);
}
