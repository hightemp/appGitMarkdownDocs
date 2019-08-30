
import _ from "underscore"
import validator from "validator"

export function fnValidateIsNotEmpty(sValue)
{
    console.log('fnValidateIsNotEmpty', sValue);

    return !validator.isEmpty(sValue) || 'Can\'t be empty.';
}

export function fnValidateRepositoryName(sValue)
{
    console.log('fnValidateRepositoryName', sValue);

    return oIndexPage.fnFindRepository({ sName: sValue }) == -1 || 'A repository with the same name already exists.';
}

export function fnValidateRepositoryURL(sValue)
{
    console.log('fnValidateRepositoryURL', sValue);
    
    return validator.isURL(sValue) || 'HTTP protocol must be used';
}
