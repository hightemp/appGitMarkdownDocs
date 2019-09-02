
import request from 'request-promise'
import gravatar from 'gravatar'
import validator from 'validator'
import Avatars from '@dicebear/avatars';
import sprites from '@dicebear/avatars-initials-sprites';

class Avatar {

    async fnGetURL(sEmail)
    {
        console.log('fnGetAvatarURL', sEmail);

        var sImageURL;

        sImageURL = await this.fetchGoogleAvatar(sEmail);

        if (!sImageURL) {
            sImageURL = await fethGravatarImage(sEmail);

            if (!sImageURL) {
                let oOptions = {};
                let oAvatars = new Avatars(await sprites(oOptions));
                sImageURL = await oAvatars.create(sEmail);
            }
        }

        return sImageURL;
    }

    async fetchGoogleAvatar(sEmail) 
    {
        console.log('fetchGoogleAvatar', sEmail);

        const googleAvatarApi = 'https://picasaweb.google.com/data/entry/api/user/'
        const avatarUrl = googleAvatarApi + sEmail + '?alt=json'
    
        var response = await request({
            method: 'GET',
            url: avatarUrl,
            gzip: true
        });
        
        if (!response || response.includes('Unable to find')) {
            return null;
        }
        const user = JSON.parse(String(response));
        const image = user.entry.gphoto$thumbnail.$t;

        return image;
    }
    
    async fethGravatarImage(sEmail) 
    {
        console.log('fethGravatarImage', sEmail);

        const gravatarUrl = gravatar.url(sEmail, { protocol: 'https', s: '100', r: 'x', d: '404' });
    
        var response = await request({
            method: 'GET',
            url: gravatarUrl,
            format: 'json'
        });

        if (response === '404 Not Found') {
            return null;
        }

        return gravatarUrl;
    }
}

module.exports = Avatar