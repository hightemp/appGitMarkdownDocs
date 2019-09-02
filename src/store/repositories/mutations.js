
export function SET(state, { iIndex, oRepository }) 
{
    console.log('SET REPOSITORY', state, { iIndex, oRepository });

    for (sKey in oRepository) {
        state[iIndex][sKey] = oRepository[sKey];
    }
}

export function ADD(state, { oRepository }) 
{
    console.log('ADD REPOSITORY', state, { oRepository });
    state.push(oRepository);
}

export function DELETE(state, { iIndex }) 
{
    console.log('DELETE REPOSITORY', state, { iIndex });
    delete state[iIndex];
}


