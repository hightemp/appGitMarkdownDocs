
export function SET_REPOSITORY(state, { iIndex, oRepository }) 
{
    console.log('SET_REPOSITORY', state, { iIndex, oRepository });

    for (sKey in oRepository) {
        state[iIndex][sKey] = oRepository[sKey];
    }
}

export function ADD_REPOSITORY(state, { oRepository }) 
{
    console.log('ADD_REPOSITORY', state, { oRepository });
    state.push(oRepository);
}

export function DELETE_REPOSITORY(state, { iIndex }) 
{
    console.log('DELETE_REPOSITORY', state, { iIndex });
    delete state[iIndex];
}


