
export function ALL(state, getters) 
{
    console.log('USERS ALL', state);
    return state;
}

export function COUNT(state, getters) 
{
    console.log('USERS COUNT', state.length);
    return state.length;
}