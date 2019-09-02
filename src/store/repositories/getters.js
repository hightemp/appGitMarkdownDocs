
export function REPOSITORIES(state, getters) 
{
    console.log('REPOSITORIES', state);
    return state;
}

export function REPOSITORIES_COUNT(state, getters) 
{
    console.log('REPOSITORIES_COUNT', state.length);
    return state.length;
}