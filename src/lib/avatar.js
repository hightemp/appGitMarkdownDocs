
import request from 'request-promise'
import gravatar from 'gravatar'
import validator from 'validator'

class Avatar {

    async fetchGoogleAvatar(email) 
    {
        const googleAvatarApi = 'https://picasaweb.google.com/data/entry/api/user/'
        const avatarUrl = googleAvatarApi + email + '?alt=json'
    
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
    
    async fethGravatarImage (email) 
    {
        const gravatarUrl = gravatar.url(email, { protocol: 'https', s: '100', r: 'x', d: '404' });
    
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