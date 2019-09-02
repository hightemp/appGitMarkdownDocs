
import User from '~/classes/User'

export function SET(state, { iIndex, oUser }) 
{
    console.log('SET USER', state, { iIndex, oUser });

    for (sKey in oUser) {
        state[iIndex][sKey] = oUser[sKey];
    }
}

export function ADD(state, { oUser }) 
{
    console.log('ADD USER', state, { oUser });
    state.push(new User(oUser));
}

export function DELETE(state, { iIndex }) 
{
    console.log('DELETE USER', state, { iIndex });
    delete state[iIndex];
}
