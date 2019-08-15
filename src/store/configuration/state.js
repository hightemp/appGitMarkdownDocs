
import os from 'os' 
import path from 'path'

export default {
    sConfigurationFileName: '.appGitMarkdownDocs.json',
    sConfigurationFilePath: path.join(os.homedir(), '.appGitMarkdownDocs.json'),
    oConfiguration: {
        sRepositoriesDirName: '.appGitMarkdownDocs_repositories',
        sRepositoriesDirPath: path.join(os.homedir(), '.appGitMarkdownDocs_repositories'),
        aUsers: []
    }
}
