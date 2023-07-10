// constants
const SET_USER = "session/SET_USER";
const REMOVE_USER = "session/REMOVE_USER";
const SET_USER_BY_ID = "session/SET_USER_BY_ID";

const setUser = (user) => ({
	type: SET_USER,
	payload: user,
});

const setUserById = (user) => ({
	type: SET_USER_BY_ID,
	payload: user,
  });


const removeUser = () => ({
	type: REMOVE_USER,
});

const initialState = { user: null };

export const authenticate = () => async (dispatch) => {
	const response = await fetch("/api/auth/", {
		headers: {
			"Content-Type": "application/json",
		},
	});
	if (response.ok) {
		const data = await response.json();
		if (data.errors) {
			return;
		}

		dispatch(setUser(data));
	}
};

export const login = (email, password) => async (dispatch) => {
	const response = await fetch("/api/auth/login", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			email,
			password,
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else if (response.status < 500) {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		}
	} else {
		return ["An error occurred. Please try again."];
	}
};

export const logout = () => async (dispatch) => {
	const response = await fetch("/api/auth/logout", {
		headers: {
			"Content-Type": "application/json",
		},
	});

	if (response.ok) {
		dispatch(removeUser());
	}
};

export const getUserById = (userId) => async (dispatch) => {
	try {
	  const response = await fetch(`/api/users/${userId}`);
	  if (response.ok) {
		const data = await response.json();
		dispatch(setUserById(data));
	  }
	} catch (error) {
	  console.log("Error fetching user:", error);
	}
  };


export const signUp = (firstName, lastName, email, password, experience, city, weight, height) => async (dispatch) => {
	const response = await fetch("/api/auth/signup", {
		method: "POST",
		headers: {
			"Content-Type": "application/json",
		},
		body: JSON.stringify({
			firstName,
			lastName,
			email,
			password,
			experience,
			city,
			weight,
			height
		}),
	});

	if (response.ok) {
		const data = await response.json();
		dispatch(setUser(data));
		return null;
	} else {
		const data = await response.json();
		if (data.errors) {
			return data.errors;
		} else {
			return ["An error occurred. Please try again."];
		}
	}
}

export default function reducer(state = initialState, action) {
	switch (action.type) {
	  case SET_USER:
		return { ...state, user: action.payload };
	  case SET_USER_BY_ID:
		return { ...state, user: action.payload };
	  case REMOVE_USER:
		return { ...state, user: null };
	  default:
		return state;
	}
  }
