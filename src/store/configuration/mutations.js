
export function SET(state, { oConfiguration }) 
{
    console.log('SET CONFIGURATION', state, { oConfiguration });
    
    state.oConfiguration = oConfiguration;
}

export function SET_USER_INDEX(state, { iUserIndex }) 
{
    console.log('SET_USER_INDEX', state, { iUserIndex });
    state.oConfiguration.iUserIndex = iUserIndex;
}

export function SET_ACTIVE_TAB(state, { iActiveTab }) 
{
    console.log('SET_ACTIVE_TAB', state, { iActiveTab });
    state.oConfiguration.iActiveTab = iActiveTab;
}
