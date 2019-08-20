
export function CONFIGURATION_STATE(state, getters) 
{
    console.log('CONFIGURATION_STATE', state, getters);
    return state;
}

export function CONFIGURATION(state, getters) 
{
    console.log('CONFIGURATION', state, getters);
    return state.oConfiguration;
}

export function USERS(state, getters) 
{
    console.log('USERS', state, getters);
    return state.oConfiguration.aUsers;
}
