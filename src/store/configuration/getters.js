
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

export function REPOSITORIES(state, getters) 
{
    console.log('REPOSITORIES', state, getters);
    return state.oConfiguration.aRepositories;
}

export function USER_INDEX(state, getters) 
{
    console.log('USER_INDEX', state, getters);
    return state.oConfiguration.iUserIndex;
}

export function ACTIVE_TAB(state, getters) 
{
    console.log('ACTIVE_TAB', state, getters);
    return state.oConfiguration.iActiveTab;
}