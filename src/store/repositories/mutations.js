
export function SET(state, { aRepositories }) 
{
    console.log('SET REPOSITORY', state, { aRepositories });

    state = aRepositories;
}

export function UPDATE(state, { iIndex, oRepository }) 
{
    console.log('UPDATE REPOSITORY', state, { iIndex, oRepository });

    for (var sKey in oRepository) {
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


