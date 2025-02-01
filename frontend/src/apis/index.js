const BACKEND_URL = import.meta.env.VITE_BACKEND_URL;

export const register = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/register`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if(response.status === 201 || response.status === 400) {
    return response.json();
  } else {
    throw new Error('Error registering user');
  }
};

export const login = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/login`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  })

  if(response.status === 200 || response.status === 400) {
    return response.json();
  } else {
    throw new Error('Error registering user');
  }
}

export const fetchUser = async() => {
  const response = await fetch(`${BACKEND_URL}/api/user`, {
    method: 'GET',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    },
  })

  if(response.status === 200 || response.status === 400) {
    return response.json();
  } else {
    throw new Error('Error fetching user');
  }
}

export const updateUser = async (data) => {
  const response = await fetch(`${BACKEND_URL}/api/user/update`, {
    method: 'PUT',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data),
  })

  if(response.status === 200 || response.status === 400){
    return response.json();
  } else {
    throw new Error('Error Updating User')
  }
}

export const deleteUser = async() => {
  const response = await fetch(`${BACKEND_URL}/api/user/delete`,{
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    }
  })

  if(response.status === 200 || response.status === 400){
    return response.json();
  } else {
    throw new Error('Error Updating User');
  }
};

export const createShortUrl = async(data) => {
  const response = await fetch (`${BACKEND_URL}/api/shortUrl`, {
    method: 'Post',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  })

  if( response.status === 201 || response.status === 400){
    return response.json();
  } else {
    throw new Error('Error in creating ShortUrl');
  }
}

export const updateShortUrl = async(id, data) => {
  const response = await fetch(`${BACKEND_URL}/api/shortUrl/${id}`, {
    method: 'PUT',
    headers:{
      'Content-type': 'application/json',
      "Authorization": `${localStorage.getItem('token')}`
    },
    body: JSON.stringify(data)
  });
  if(response.status === 200 || response.status === 400){
    return response.json();
  } else {
    throw new Error('Error in updating Url Info')
  }
}

export const fetchAnalytics = async() => {
  const response = await fetch(`${BACKEND_URL}/api/analytics`, {
    method: 'GET',
    headers:{
      'Content-type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    }
  }) 

  if(response.status === 200 || response.status === 400){
    return response.json();
  } else {
    throw new Error('No data found');
  }
}

export const getAllUrls = async() => {
  const response = await fetch(`${BACKEND_URL}/api/allurls`, {
    method: 'GET',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`
    }
  });

  if(response.status === 200 || response.status === 400){
    return response.json();
  } else {
    throw new Error('No Urls Found');
  }
}

export const getUrl = async(id) => {
  const response = await fetch(`${BACKEND_URL}/api/singleurl/${id}`, {
    method: 'GET',
    headers:{
    'Content-type': 'application/json',
    'Authorization': `${localStorage.getItem('token')}`}
  });
  if(response.status === 200 || response.status === 400){
    return response.json();
  } else {
    throw new Error('Error in getting Url');
  }
}

export const deleteUrl = async(id) => {
  const response = await fetch(`${BACKEND_URL}/api/shortUrl/${id}`, {
    method: 'DELETE',
    headers: {
      'Content-type': 'application/json',
      'Authorization': `${localStorage.getItem('token')}`,
    }
  })
  if(response.status === 200 || response.status === 400) {
    return response.json();
  }
}