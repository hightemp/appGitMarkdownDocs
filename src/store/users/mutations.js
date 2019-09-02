
import User from '~/classes/User'

export function SET_USER(state, { iIndex, oUser }) 
{
    console.log('SET_USER', state, { iIndex, oUser });

    for (sKey in oUser) {
        state[iIndex][sKey] = oUser[sKey];
    }
}

export function ADD_USER(state, { oUser }) 
{
    console.log('ADD_USER', state, { oUser });
    state.push(new User(oUser));
}

export function DELETE_USER(state, { iIndex }) 
{
    console.log('DELETE_USER', state, { iIndex });
    delete state[iIndex];
}
