
export function SET_CONFIGURATION(state, { oConfiguration }) 
{
    console.log('SET_CONFIGURATION', state, { oConfiguration });
    state.oConfiguration = oConfiguration;
}

export function SET_REPOSITORY(state, { iIndex, oRepository }) 
{
    console.log('SET_REPOSITORY', state, { iIndex, oRepository });
    state.oConfiguration.aRepositories[iIndex] = oRepository;
}

export function ADD_REPOSITORY(state, { oRepository }) 
{
    console.log('ADD_REPOSITORY', state, { oRepository });
    state.oConfiguration.aRepositories.push(oRepository);
}

export function SET_USER(state, { iIndex, oUser }) 
{
    console.log('SET_USER', state, { iIndex, oUser });
    state.oConfiguration.aUsers[iIndex] = oUser;
}

export function ADD_USER(state, { oUser }) 
{
    console.log('ADD_USER', state, { oUser });
    state.oConfiguration.aUsers.push(oUser);
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
