
import User from '~/classes/User'

export function SET(state, { aUsers }) 
{
    console.log('SET USER', state, { aUsers });

    state = aUsers;
}

export function UPDATE(state, { iIndex, oUser }) 
{
    console.log('UPDATE USER', state, { iIndex, oUser });

    for (var sKey in oUser) {
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
