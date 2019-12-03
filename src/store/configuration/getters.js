
export function STATE(state, getters) 
{
    console.log('CONFIGURATION STATE', state);
    return state;
}

export function CONFIGURATION(state, getters) 
{
    console.log('CONFIGURATION', state.oConfiguration);
    return state.oConfiguration;
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