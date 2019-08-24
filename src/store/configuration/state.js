
import os from 'os' 
import path from 'path'

export default {
    sConfigurationFileName: 'config.json',
    sConfigurationDirPath: path.join(os.homedir(), '.appGitMarkdownDocs'),
    sConfigurationFilePath: path.join(os.homedir(), '.appGitMarkdownDocs', 'config.json'),
    oConfiguration: {
        sRepositoriesDirName: 'repositories',
        sRepositoriesDirPath: path.join(os.homedir(), '.appGitMarkdownDocs', 'repositories'),

        iUserIndex: -1,
        aUsers: [
            /*
            {
                sLogin: '',
                sAvatarImageURL: '',
                sAvatarImageData: '',
                sUserName: '',
                sEmail: '',
                sPassword: ''
            }
            */
        ],

        iActiveTab: -1,
        aRepositories: [
            /*
            {
                sName: "test",
                sURL: "git@github.com:hightemp/wappGitMarkdownDocs.git",
                iUserIndex: 0,
                sPath: '',
                oTags: {
                    "tag1": [
                        "article1"
                    ],
                    "tag2": [
                        "article2"
                    ],
                    "tag3": [],
                    "tag4": [],
                    "tag5": [],
                    "tag6": [],
                    "tag7": [],
                    "tag8": [],
                    "tag9": [],
                    "tag10": [],
                    "tag11": [],
                    "tag12": [],
                    "tag13": [],
                    "tag14": [],
                    "tag15": [],
                    "tag16": [],
                    "tag17": [],
                },
                oPinndedTags: {
                    "tag3": [],
                    "tag4": [],
                    "tag5": [],
                    "tag6": [],
                    "tag7": [],                        
                },
                aArticles: [
                    "article1",
                    "article2",
                    "article3",
                ]
            },
            {
                sName: "test2",
            },
            {
                sName: "test3",
            },
            {
                sName: "test4",
            },
            {
                sName: "test5",
            },
            {
                sName: "test6",
            },
            {
                sName: "test7",
            }
            */
        ]
    }
}
