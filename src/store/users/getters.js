
export function USERS(state, getters) 
{
    console.log('USERS', state);
    return state;
}

export function USERS_COUNT(state, getters) 
{
    console.log('USERS_COUNT', state.length);
    return state.length;
}