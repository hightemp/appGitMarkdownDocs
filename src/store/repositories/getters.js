
export function ALL(state, getters) 
{
    console.log('REPOSITORIES ALL', state);
    return state;
}

export function COUNT(state, getters) 
{
    console.log('REPOSITORIES COUNT', state.length);
    return state.length;
}