
export function SET_CONFIGURATION(state, { oConfiguration }) 
{
    console.log('SET_CONFIGURATION', state, { oConfiguration });
    state.oConfiguration = oConfiguration;
}
