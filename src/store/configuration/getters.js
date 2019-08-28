
export function CONFIGURATION_STATE(state, getters) 
{
    console.log('CONFIGURATION_STATE', state);
    return state;
}

export function CONFIGURATION(state, getters) 
{
    console.log('CONFIGURATION', state.oConfiguration);
    return state.oConfiguration;
}

export function USERS(state, getters) 
{
    console.log('USERS', state.oConfiguration.aUsers);
    return state.oConfiguration.aUsers;
}

export function USERS_COUNT(state, getters) 
{
    console.log('USERS_COUNT', state.oConfiguration.aUsers.length);
    return state.oConfiguration.aUsers.length;
}

export function REPOSITORIES(state, getters) 
{
    console.log('REPOSITORIES', state.oConfiguration.aRepositories);
    return state.oConfiguration.aRepositories;
}

export function REPOSITORIES_COUNT(state, getters) 
{
    console.log('REPOSITORIES_COUNT', state.oConfiguration.aRepositories.length);
    return state.oConfiguration.aRepositories.length;
}

export function USER_INDEX(state, getters) 
{
    console.log('USER_INDEX', state.oConfiguration.iUserIndex);
    return state.oConfiguration.iUserIndex;
}

export function ACTIVE_TAB(state, getters) 
{
    console.log('ACTIVE_TAB', state.oConfiguration.iActiveTab);
    return state.oConfiguration.iActiveTab;
}