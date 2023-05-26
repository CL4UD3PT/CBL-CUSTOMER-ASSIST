const getState = ({ getStore, getActions, setStore }) => {
	return {
		store: {
			token: null,
			user: {},
			message: null
		},
		actions: {
			syncTokenFromSessionStorage: () => {
				const token = sessionStorage.getItem('token');
				if (token && token != "" && token != undefined) setStore({ token: token });
			},

			login: async (email, password) => {
				const opts = {
					method: "POST",
					headers: {
						"Content-Type": "application/json"
					},
					body: JSON.stringify({
						email: email,
						password: password
					})
				};
				try {
					// const response = await fetch(process.env.BACKEND_URL + "/api/login", {
					const response = await fetch(process.env.BACKEND_URL + "api/token", opts);
					if (response.status !== 200) {
						alert("There has been some error!");
						return false;
					}

					const data = await response.json();
					console.log("This came from the backend", data);
					sessionStorage.setItem("token", data.access_token);
					setStore({ token: data.access_token })
					return true;
				}
				catch (error) {
					console.log("There has been an error login in!")
				}
			},

			logout: () => {
				sessionStorage.removeItem('token');
				console.log("Login out")
				setStore({ token: null });
			},

			getMessage: async () => {
				const token = getStore().token;
				const opts = {
					headers: {
						"Authorization": "Bearer " + token
					}
				}
				const response = await fetch(process.env.BACKEND_URL + "api/hello", opts);
				if (response.status != 200) {
					alert("Something went wrong with your authorization!");
					return false;
				}

				const data = await response.json();
				setStore({ "message": data.message });
				console.log(getStore().message);
			}
		}
	};
};

export default getState;
