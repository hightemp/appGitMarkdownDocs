
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
        iActiveTab: -1
    }
}
