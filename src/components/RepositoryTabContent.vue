
<template>
    <div class="repository-panel">
        <div class="tags-panel">
            <div class="list-filter-panel">
                <q-input dense square filled v-model="sTagFilterString" label="Filter tags">
                    <template v-slot:append>
                        <q-icon v-if="sTagFilterString != ''" name="clear" class="cursor-pointer" @click="sTagFilterString = ''" />
                    </template>
                </q-input>
                <div class="list-filter-panel-buttons-panel">
                    <q-btn square flat icon="add" />
                </div>
            </div>

            <div 
                class="pinned-tags-group" 
                ref="pinned_tags_group"
            >
                <q-list separator>
                    <q-item 
                        clickable 
                        v-ripple
                        active-class="list-active-item"
                        v-for="(aItem, sKey) in oRepository.oPinndedTags"
                        :active="aSelectedTags.indexOf(sKey)!=-1"
                    >
                        <q-item-section>
                            <q-item-label>{{ sKey }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge label="10k" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
            
            <q-separator />

            <div 
                class="tags-list-group" 
                ref="tags_list_group" 
            >
                <q-list separator>
                    <q-item 
                        clickable 
                        v-ripple
                        active-class="list-active-item"
                        v-for="(aItem, sKey) in oRepository.oTags"
                        :active="aSelectedTags.indexOf(sKey)!=-1"
                    >
                        <q-item-section>
                            <q-item-label>{{ sKey }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge label="10k" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
                
        </div>
        <div class="articles-panel">
            
        </div>
        <div class="editor-panel">
            
        </div>
        <div class="viewer-panel">
            
        </div>
    </div>
</template>

<script>
    
import Vue, { VueConstructor } from 'vue'

export default {
    name: 'RepositoryTabContent',
    
    props: {
        iIndex: {
            type: Number
        },
        oRepository: {
            type: Object,
            required: true
        },
        bActive: {
            type: Boolean,        
            required: true
        }
    },

    data: function()
    {
        return {
            bShowSaveButtonSpinner: false,
            bShowArticleViewContentsSpinner: false,
            
            bEditorDirty: false,
            
            oSimpleMDE: null,
            oUploadedFile: null,
            
            bPasteAsText: false,
            bShowReplacementBlock: false,
            bShowTranslationBlock: false,
            
            bSearchInSelection: false,
            bUseRegularExpression: false,
            bUseCaseSensetive: false,
            iSearchPosFrom: null,
            iSearchPosTo: null,
            sSearchLastQuery: null,
            sSearchQuery: '',
            sSearchQueryText: '',
            oSearchOverlay: null,
            oSearchAnnotate: null,
            
            aTranslationProviders: [
                { value: 'google', text: 'Google' },
                { value: 'yandex', text: 'Yandex' }
            ],
            sTranslationProvider: 'google',
            aTranslationFromLanguage: [
                { value: 'auto', text: 'Auto' },
                { value: 'en', text: 'English' },
                { value: 'ru', text: 'Russian' }
            ],
            sTranslationFromLanguage: 'auto',
            aTranslationToLanguage: [
                { value: 'en', text: 'English' },
                { value: 'ru', text: 'Russian' }
            ],
            sTranslationToLanguage: 'ru',
            
            bEnableDiffEditor1: true,
            bEnableDiffEditor2: true,
            aDiffMethodsOptions: [
                {
                    text: 'comparing character by character',
                    value: 'diffChars'
                },
                {
                    text: 'comparing word by word, ignoring whitespace',
                    value: 'diffWords'
                },
                {
                    text: 'comparing word by word, treating whitespace as significant',
                    value: 'diffWordsWithSpace'
                },
                {
                    text: 'comparing line by line',
                    value: 'diffLines'
                },
                {
                    text: 'comparing line by line, ignoring leading and trailing whitespace',
                    value: 'diffTrimmedLines'
                },
                {
                    text: 'comparing sentence by sentence',
                    value: 'diffSentences'
                },
                {
                    text: 'comparing CSS tokens',
                    value: 'diffCss'
                }
            ],
            sDiffMethod: 'diffChars',
            iDiffRemovals: 0,
            iDiffAdditions: 0,
            sDiffText1: '',
            sDiffText2: '',
            sDiffEditor1HTML: '',
            sDiffEditor2HTML: '',
            bIgnoreDiffScrollEvents: false,
            
            sYoutubeVideoURL: '',
            
            i_bShowEditor: true,
            
            aHeaders: [],
            sHeadersMarkdown: '',
                
            sMathJaxFormula: '',
            
            aImagesModalFiles: [],
            aImagesModalSelectedFiles: [],
            sImagesFilterString: '',
            sUploadImagesMode: '',
            iImagesModalScrollPosition: 0,
            
            aFilesModalFiles: [],           
            aFilesModalSelectedFiles: [],
            sFilesFilterString: '',
            sUploadFilesMode: '',
            iFilesModalScrollPosition: 0,
            
            aArticlesSearchResults: [],
            
            sNewTag: '',
            sNewTagFieldState: '',
            sNewTagInvalidFeedback: '',
            sNewTagModalMode: '',
            
            sNewArticle: '',
            sNewArticleFieldState: '',
            sNewArticleInvalidFeedback: '',
            sNewArticleModalMode: '',
            
            sArticleViewContents: '',
            iArticleViewScrollPosition: 0,
            
            i_bLockArticleViewScroll: false,
            bIgnoreArticleViewScrollEvents: false,
            
            sActiveTag: "__all__",
            aSelectedTags: [],
            iActiveArticle: -1,
            sTagFilterString: "",
            sArticleFilterString: "",
            sCurrentArticleTagFilterString: "",
            bCurrentArticleFilterSelectedTags: false,
            
            oSettings: {
                aPinnedTags: []
            }
        };
    },
    
    created: function()
    {
        console.log('repositories tab created');
    }
};

</script>
