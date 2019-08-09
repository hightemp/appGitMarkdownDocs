
<template>
    <div class="repository-panel">
        <div class="tags-panel">
            <div class="list-filter-panel">
                <q-input dense square filled v-model="sTagFilterString" label="Filter tags">
                    <template v-slot:append>
                        <q-icon v-if="sTagFilterString != ''" name="backspace" class="cursor-pointer" @click="sTagFilterString = ''" />
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
                <q-item 
                    clickable 
                    v-ripple
                    active-class="list-active-item"
                    :active="sActiveTag=='__all__'"
                    @click="fnSelectTag('__all__')"
                >
                    <q-item-section left side>
                        <q-icon name="label" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>All</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-badge :label="fnGetArticlesCountByTagName('__all__')" />
                    </q-item-section>
                </q-item>
                
                <q-separator />
                
                <q-item 
                    clickable 
                    v-ripple
                    active-class="list-active-item"
                    :active="sActiveTag=='__untagged__'"
                    @click="fnSelectTag('__untagged__')"
                >
                    <q-item-section left side>
                        <q-icon name="label_off" />
                    </q-item-section>

                    <q-item-section>
                        <q-item-label>Untagged</q-item-label>
                    </q-item-section>

                    <q-item-section side>
                        <q-badge label="10k" />
                    </q-item-section>
                </q-item>
                
                <q-separator 
                    v-if="oSettings.aPinnedTags.length"
                />
                
                <q-list separator>
                    <q-item 
                        clickable 
                        v-ripple
                        active-class="list-active-item"
                        v-for="(sTag, iKey) in oSettings.aPinnedTags"
                        :active="aSelectedTags.indexOf(sTag)!=-1"
                        v-if="
                            (
                                sTagFilterString=='' 
                                || (
                                    sTagFilterString!='' 
                                    && sTag.toLowerCase().indexOf(sTagFilterString.toLowerCase())!=-1
                                )
                            )
                        "
                        @click="fnSelectTag(sTag, true)"
                        @dblclick="fnSelectTag(sTag)"                        
                    >
                        <q-item-section left side>
                            <q-icon name="bookmark" />
                        </q-item-section>
                        
                        <q-item-section>
                            <q-item-label>{{ sKey }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge :label="fnGetArticlesCountByTagName(sKey)" />
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
                        v-if="
                            (
                                sTagFilterString=='' 
                                || (
                                    sTagFilterString!='' 
                                    && sKey.toLowerCase().indexOf(sTagFilterString.toLowerCase())!=-1
                                )
                            )
                            && oSettings.aPinnedTags.indexOf(sKey)==-1
                            && fnDoTagsHaveCollisions(sKey)
                        "
                        @click="fnSelectTag(sKey, true)"
                        @dblclick="fnSelectTag(sKey)"
                    >
                        <q-item-section>
                            <q-item-label>{{ sKey }}</q-item-label>
                        </q-item-section>

                        <q-item-section side>
                            <q-badge :label="fnGetArticlesCountByTagName(sKey)" />
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
                
        </div>
        <div class="articles-panel">
            <div class="list-filter-panel">
                <q-input 
                    dense 
                    square 
                    filled 
                    v-model="sArticleFilterString" 
                    label="Filter tags"
                >
                    <template v-slot:append>
                        <q-icon v-if="sArticleFilterString != ''" name="backspace" class="cursor-pointer" @click="sArticleFilterString = ''" />
                    </template>
                </q-input>
                <div class="list-filter-panel-buttons-panel">
                    <q-btn square flat icon="add" />
                </div>
            </div>

            <div 
                class="articles-list-group" 
            >
                <q-list separator>
                    <q-item 
                        clickable 
                        v-ripple
                        active-class="list-active-item"
                        v-for="(sItem, iIndex) in aArticles"
                        :active="iActiveArticle==iIndex"
                        v-if="sArticleFilterString=='' 
                            || (
                                (
                                    sArticleFilterString!=''
                                    && sArticleFilterString[0]=='%'
                                    && aArticlesSearchResults.indexOf(sItem)!=-1
                                )
                                || (
                                    sArticleFilterString!=''
                                    && sArticleFilterString[0]=='#'
                                    && sArticleFilterString[1]=='#'
                                    && !fnCountArticleInTags(sItem)
                                    && sItem.toLowerCase().indexOf(sArticleFilterString.replace(/^##/,'').toLowerCase())!=-1
                                )
                                || (
                                    sArticleFilterString!='' 
                                    && (
                                        sArticleFilterString[0]!='%' 
                                        || (
                                            sArticleFilterString[0]!='#'
                                            && sArticleFilterString[1]!='#'
                                        )
                                    )
                                    && sItem.toLowerCase().indexOf(sArticleFilterString.toLowerCase())!=-1
                                )
                            )"
                        @click="fnSelectArticle(iIndex)"                        
                    >
                        <q-item-section>
                            <q-item-label>{{ sItem }}</q-item-label>
                        </q-item-section>
                    </q-item>
                </q-list>
            </div>
            
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
    
    computed: {
        bTagPinned: {
            set: function(bValue)
            {
                console.log("bTagPinned set 1 ", bValue, this.sActiveTag);
                var iIndex = this.oSettings.aPinnedTags.indexOf(this.sActiveTag);
                
                if (bValue) {
                    if (iIndex!=-1) {
                        return;
                    }
                    this.oSettings.aPinnedTags.push(this.sActiveTag);
                } else {
                    if (iIndex==-1) {
                        return;
                    }
                    this.oSettings.aPinnedTags.splice(iIndex, 1);
                }
                
                window.oApplication.bShowLoadingScreen = true;
            
                this
                    .$http
                    .post(
                        '',
                        {
                            action: 'save_settings',
                            repository: this.oRepository.sName,
                            settings: JSON.stringify(this.oSettings)
                        }
                    ).then(function(oResponse)
                    {
                        window.oApplication.bShowLoadingScreen = false;

                        if (oResponse.body.status=='error') {
                            this.$snotify.error(oResponse.body.message, 'Error');
                            return;
                        }
                    })
                    .catch(function(sError)
                    {
                        this.$snotify.error(sError);
                        window.oApplication.bShowLoadingScreen = false;
                    });
                console.log("bTagPinned set 2 ", this.oSettings.aPinnedTags);
            },
            get: function()
            {
                console.log("bTagPinned get", this.oSettings.aPinnedTags, this.oSettings.aPinnedTags.indexOf(this.sActiveTag));
                return this.oSettings.aPinnedTags.indexOf(this.sActiveTag)!=-1;
            }
        },
        bShowEditor: {
            set: function(bValue)
            {
                this.i_bShowEditor = !!bValue;
                localStorage.setItem(this.oRepository.sName+'_bShowEditor', this.i_bShowEditor ? '1' : '');
            },
            get: function()
            {
                return this.i_bShowEditor;
            }
        },
        bLockArticleViewScroll: {
            set: function(bValue)
            {
                this.i_bLockArticleViewScroll = bValue;
                
                if (bValue) {
                    this.fnArticleViewScroll();
                }
            },
            get: function()
            {
                return this.i_bLockArticleViewScroll;
            }
        },
        aArticles: function() 
        {
            console.log('aArticles', this.oRepository.aArticles, this.oRepository.oTags[this.sActiveTag]);
            
            if (this.aSelectedTags.length>1) {
                return this.fnGetSelectedTagsArticles();
            }

            if (this.sActiveTag=="__all__") {
                return this.oRepository.aArticles;
            }
            
            if (typeof this.oRepository.oTags[this.sActiveTag] === 'undefined') {
                return [];
            }
            
            return this.oRepository.oTags[this.sActiveTag];
        },
        sActiveArticle: function()
        {
            return this.aArticles[this.iActiveArticle];
        }
    },
    
    methods: {
        fnPushRepository: function(bPushOnly, fnCallback)
        {
            var oData = {
                action: 'push_repository',
                repository: this.oRepository.sName
            };
            
            if (!bPushOnly) {
                this.bShowSaveButtonSpinner = true;
                oData['article'] = this.aArticles[this.iActiveArticle];
                oData['tags'] = this.fnFindTagsWithArticle(this.aArticles[this.iActiveArticle]);
                oData['data'] = this.oSimpleMDE.value();
            }
            
            this
                .$http
                .post(
                    '',
                    oData
                ).then(function(oResponse)
                {
                    this.bEditorDirty = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    this.$snotify.success("Repository successfully saved");
                    
                    if (!bPushOnly) {
                        this.bShowSaveButtonSpinner = false;
                    }
                    
                    this.fnRefreshArticleViewer();
                    
                    if (fnCallback) fnCallback();
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                });            
        },
        fnPullRepository: function(fnCallback)
        {
            
        },
        fnShowHeadersModal: function()
        {
            this.aHeaders = [];
            
            var oHeaders = this.$refs.article_view_contents.querySelectorAll('h1,h2,h3,h4,h5,h6');
            this.sHeadersMarkdown = '';
            var iCurrentLevel = 0;
            
            for (var iIndex=1; iIndex<oHeaders.length; iIndex++) {
                var sID = oHeaders[iIndex].querySelector('a').getAttribute('id');
                var iLevel = oHeaders[iIndex].tagName.replace('H', '')*1;

                if (iLevel==1) {
                    continue;
                }
                
                if (iLevel>iCurrentLevel) {
                    iCurrentLevel = iLevel - 2;
                }
                if (iLevel<iCurrentLevel) {
                    iCurrentLevel = iLevel - 2;
                }
                
                this.sHeadersMarkdown += '  '.repeat(iCurrentLevel)+'* ['+oHeaders[iIndex].innerText+'](#'+sID+")\n";
                
                this.aHeaders.push({
                    iLevel: iLevel,
                    sTitle: oHeaders[iIndex].innerText,
                    sHref: '#'+sID
                });
            }
            
            this.$refs.headers_modal.show();
        },
        fnCheckNewTagForm: function()
        {
            console.log('fnCheckNewTagForm');
            var bValid = this.$refs.add_new_tag_modal_form.checkValidity();
            
            if (this.oRepository.oTags[this.sNewTag]) {
                this.sNewTagInvalidFeedback = "Tag already exists";
                this.sNewTagFieldState = 'invalid';
                return false;
            }
            
            this.sNewTagInvalidFeedback = "Tag is required";
            
            this.sNewTagFieldState = bValid ? 'valid' : 'invalid';
            
            return bValid;
        },
        fnNewTagFormSubmit: function(oEvent)
        {
            console.log('fnNewTagFormSubmit');
            
            oEvent.preventDefault();
            
            if (!this.fnCheckNewTagForm()) {
                return;
            }

            this.$nextTick(function() {
                this.$refs.add_new_tag_modal.hide();
            });
            
            if (this.sNewTagModalMode == 'add') {
                this.fnAddTag();
            }
            if (this.sNewTagModalMode == 'rename') {
                this.fnRenameTag();
            }
        },
        fnShowNewTagModal: function()
        {
            this.sNewTagModalMode = 'add';
            
            this.$refs.add_new_tag_modal.show();

            var oThis = this;
            
            setTimeout(function() {
                oThis.$refs.add_new_tag_modal.title = 'Add new tag';
            }, 300);
            
            this.fnResetNewTagModal();
        },
        fnShowRenameTagModal: function()
        {
            this.sNewTagModalMode = 'rename';
            this.$refs.add_new_tag_modal.show();
            
            var oThis = this;
            
            setTimeout(function() {
                oThis.$refs.add_new_tag_modal.title = 'Rename tag';
            }, 300);
            
            this.fnResetNewTagModal();
            this.sNewTag = this.sActiveTag;
        },
        fnResetNewTagModal: function ()
        {
            console.log('fnResetNewTagModal');
            this.sNewTag = '';
            this.sNewTagFieldState = '';
            
            var oThis = this;
            
            setTimeout(function() {
                oThis.$refs.add_new_tag_modal_tag_input.$el.focus();
            }, 300);
        },
        fnRenameTag: function(fnCallback)
        {
            console.log('fnRenameTag', this.sNewTag);
            
            window.oApplication.bShowLoadingScreen = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'rename_tag',
                        repository: this.oRepository.sName,
                        articles: this.oRepository.oTags[this.sActiveTag],
                        from_tag: this.sActiveTag,
                        to_tag: this.sNewTag
                    }
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    var oTags = {};
                    
                    for (var sTag in this.oRepository.oTags) {
                        if (sTag==this.sActiveTag) {
                            oTags[this.sNewTag] = this.oRepository.oTags[sTag];
                        } else {
                            oTags[sTag] = this.oRepository.oTags[sTag];
                        }
                    }
                    
                    Vue.set(this.oRepository, 'oTags', oTags);
                    
                    //this.fnPushRepository(true);
                    
                    var iActiveArticle = this.iActiveArticle;
                    this.fnSelectTag(this.sNewTag);
                    this.fnSelectArticle(iActiveArticle);
                    
                    if (fnCallback) fnCallback.call(this);
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });            
        },
        fnAddTag: function(fnCallback)
        {
            console.log('fnAddTag', this.sNewTag);
            
            window.oApplication.bShowLoadingScreen = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'create_tag',
                        repository: this.oRepository.sName,
                        tag: this.sNewTag
                    }
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    Vue.set(this.oRepository.oTags, this.sNewTag, []);
                    
                    //this.fnSelectTag(this.sNewTag);
                    
                    if (fnCallback) fnCallback.call(this);
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
        },
        fnRemoveTag: function(fnCallback)
        {
            if (this.sActiveTag=="__all__") {
                return false;
            }

            if (!confirm("Delete tag '"+this.sActiveTag+"'?")) {
                return;
            }
            
            window.oApplication.bShowLoadingScreen = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'remove_tag',
                        repository: this.oRepository.sName,
                        tag: this.sActiveTag
                    }
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    var sActiveTag = this.sActiveTag;
                    var sArticle = this.oRepository.oTags[sActiveTag][this.iActiveArticle];
                        
                    this.fnSelectTag('__all__');
                    this.fnSelectArticleWithName(sArticle);
                    
                    delete this.oRepository.oTags[sActiveTag];
                    
                    if (fnCallback) fnCallback.call(this);
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
        },
        fnGetSelectedTagsArticles(sWithTag)
        {
            var aResult = [];            
            var aSelectedTags = [];
            
            for (var iIndexST=0; iIndexST<this.aSelectedTags.length; iIndexST++) {
                aSelectedTags.push(this.aSelectedTags[iIndexST]);
            }
            
            if (sWithTag) {
                aSelectedTags.push(sWithTag);
            }
            
            aResult = [];
            
            var aSelectedTagArticles = this.oRepository.oTags[aSelectedTags[0]];
            
            for (var iIndexSTA=0; iIndexSTA<aSelectedTagArticles.length; iIndexSTA++) {
                aResult.push(aSelectedTagArticles[iIndexSTA]);
            }

            for (var iIndexST=1; iIndexST<aSelectedTags.length; iIndexST++) {
                var sTag = aSelectedTags[iIndexST];

                for (var iIndex1=0; iIndex1<aResult.length; iIndex1++) {
                    var iArticleIndex = this.oRepository.oTags[sTag].indexOf(aResult[iIndex1]);

                    if (iArticleIndex==-1) {
                        aResult.splice(iIndex1, 1);
                        iIndex1--;
                    }
                }
            }
            
            return aResult;
        },
        fnDoTagsHaveCollisions(sTag)
        {
            if (this.sActiveTag=='__all__') {
                return true;
            }
            
            if (this.aSelectedTags.indexOf(sTag)!=-1) {
                return true;
            }
            
            return this.fnGetSelectedTagsArticles(sTag).length > 0;
        },
                
        fnCheckNewArticleForm: function()
        {
            console.log('fnCheckNewArticleForm');
            var bValid = this.$refs.add_new_article_modal_form.checkValidity();
            
            if (this.oRepository.aArticles.indexOf(this.sNewArticle)!=-1) {
                this.sNewArticleInvalidFeedback = "Article already exists";
                this.sNewArticleFieldState = 'invalid';
                return false;
            }

            this.sNewArticleInvalidFeedback = "Article name is required";
            
            this.sNewArticleFieldState = bValid ? 'valid' : 'invalid';
            
            return bValid;
        },
        fnNewArticleFormSubmit: function(oEvent)
        {
            console.log('fnNewTagFormSubmit');
            oEvent.preventDefault();
            
            if (!this.fnCheckNewArticleForm()) {
                return;
            }

            this.$nextTick(function() {
                this.$refs.add_new_article_modal.hide();
            });
            
            if (this.sNewArticleModalMode == 'add') {
                this.fnAddArticle();
            }
            if (this.sNewArticleModalMode == 'rename') {
                this.fnRenameArticle();
            }            
        },
        fnResetNewArticleModal: function ()
        {
            console.log('fnResetNewTagModal');
            this.sNewArticle = '';
            this.sNewArticleFieldState = '';
            
            var oThis = this;
            
            setTimeout(function() {
                oThis.$refs.add_new_article_modal_article_name_input.$el.focus();
            }, 300);
        },   
        fnShowNewArticleModal: function()
        {
            console.log('fnShowNewArticleModal');
            this.sNewArticleModalMode = 'add';
            this.$refs.add_new_article_modal.show();

            var oThis = this;
            
            setTimeout(function() {
                oThis.$refs.add_new_article_modal.title = 'Add new article';
            }, 300);

            this.fnResetNewArticleModal();
        },
        fnShowRenameArticleModal: function()
        {
            console.log('fnShowRenameArticleModal');
            this.sNewArticleModalMode = 'rename';
            this.$refs.add_new_article_modal.show();

            var oThis = this;
            
            setTimeout(function() {
                oThis.$refs.add_new_article_modal.title = 'Rename article';
            }, 300);

            this.fnResetNewArticleModal();
            this.sNewArticle = this.aArticles[this.iActiveArticle];
        },
        fnRenameArticle: function(fnCallback)
        {
            console.log('fnRenameArticle', this.sNewTag);
            
            window.oApplication.bShowLoadingScreen = true;
            
            var sArticle = this.aArticles[this.iActiveArticle];
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'rename_article',
                        repository: this.oRepository.sName,
                        tags: this.fnFindTagsWithArticle(this.aArticles[this.iActiveArticle]),
                        from_article: sArticle,
                        to_article: this.sNewArticle
                    }
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    for (var sTag in this.oRepository.oTags) {
                        var iIndex = this.oRepository.oTags[sTag].indexOf(sArticle);
                        
                        if (iIndex>-1) {
                            this.oRepository.oTags[sTag].splice(iIndex, 1, this.sNewArticle);
                        }
                    }
                    
                    var iIndex = this.oRepository.aArticles.indexOf(sArticle);
                    
                    if (iIndex>-1) {
                        this.oRepository.aArticles.splice(iIndex, 1, this.sNewArticle);
                    }
                    
                    console.log(this.oRepository.sName+'_iActiveArticle', this.sNewArticle);
                    localStorage.setItem(this.oRepository.sName+'_iActiveArticle', this.sNewArticle);
                    
                    if (fnCallback) fnCallback.call(this);
                    
                    //this.fnPushRepository(true);
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });            
        },        
        fnAddArticle: function(fnCallback)
        {
            console.log('fnAddArticle');
            
            window.oApplication.bShowLoadingScreen = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'add_article',
                        repository: this.oRepository.sName,
                        tags: this.aSelectedTags,
                        article: this.sNewArticle
                    }
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    this.oRepository.aArticles.push(this.sNewArticle);
                    
                    if (this.sActiveTag!='__all__') {
                        for (var iIndex=0; iIndex<this.aSelectedTags.length; iIndex++) {
                            this.oRepository.oTags[this.aSelectedTags[iIndex]].push(this.sNewArticle);
                        }
                        //this.fnSelectArticle(this.oRepository.oTags[this.sActiveTag].length-1);
                        this.fnSelectArticleWithName(this.sNewArticle);
                    } else {
                        this.fnSelectArticleWithName(this.sNewArticle);
                    }
                    
                    if (fnCallback) fnCallback.call(this);
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
        },
        fnRemoveArticle: function(fnCallback)
        {
            if (!confirm("Delete article '"+this.aArticles[this.iActiveArticle]+"'?")) {
                return;
            }
            
            window.oApplication.bShowLoadingScreen = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'remove_article',
                        repository: this.oRepository.sName,
                        article: this.aArticles[this.iActiveArticle]
                    }
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    var iActiveArticle = this.iActiveArticle;
                    var iNewiActiveArticle = this.iActiveArticle;
                    
                    if (iNewiActiveArticle>0) {
                        iNewiActiveArticle--;
                    } else {
                        iNewiActiveArticle = 0;
                    }
                    
                    var sArticle = this.aArticles[iActiveArticle];
                    
                    var iIndex = this.oRepository.aArticles.indexOf(sArticle);
                    this.oRepository.aArticles.splice(iIndex, 1);
                    
                    for (var sTag in this.oRepository.oTags) {
                        var iIndex = this.oRepository.oTags[sTag].indexOf(sArticle);
                        if (iIndex>-1) {
                            this.oRepository.oTags[sTag].splice(iIndex, 1);
                        }
                    }
                    
                    this.fnSelectArticle(iNewiActiveArticle);
                    
                    if (fnCallback) fnCallback.call(this);
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
        },
        fnAddArticleTag: function(sArticle, sTag)
        {
            window.oApplication.bShowLoadingScreen = true;
            
            var oThis = this;
            
            this.fnPushRepository(
                false, 
                function()
                {
                    oThis
                        .$http
                        .post(
                            '',
                            {
                                action: 'add_tag_to_article',
                                repository: oThis.oRepository.sName,
                                article: sArticle,
                                tag: sTag
                            }
                        ).then(function(oResponse)
                        {                    
                            window.oApplication.bShowLoadingScreen = false;
                            
                            if (oResponse.body.status=='error') {
                                oThis.$snotify.error(oResponse.body.message, 'Error');
                                return;
                            }
                            
                            oThis.oRepository.oTags[sTag].push(sArticle);
                            
                            oThis.fnRefreshArticleViewer();
                            //oThis.fnSelectArticle(oThis.iActiveArticle);
                        })
                        .catch(function(sError)
                        {
                            oThis.$snotify.error(sError);
                            window.oApplication.bShowLoadingScreen = false;
                        });                
                }
            );
        },
        fnRemoveArticleTag: function(sArticle, sTag)
        {
            window.oApplication.bShowLoadingScreen = true;
            
            var oThis = this;
            
            this.fnPushRepository(
                false, 
                function()
                {
                    oThis
                        .$http
                        .post(
                            '',
                            {
                                action: 'remove_tag_from_article',
                                repository: oThis.oRepository.sName,
                                article: sArticle,
                                tag: sTag
                            }
                        ).then(function(oResponse)
                        {
                            window.oApplication.bShowLoadingScreen = false;
                            
                            if (oResponse.body.status=='error') {
                                oThis.$snotify.error(oResponse.body.message, 'Error');
                                return;
                            }
                            
                            var iIndex = oThis.fnFindArticleInTag(sArticle, sTag);
                            if (oThis.iActiveArticle == iIndex) {
                                var sArticle = oThis.oRepository.oTags[sTag][iIndex];
                                
                                oThis.fnSelectTag('__all__');
                                oThis.fnSelectArticleWithName(sArticle);
                            }
                            oThis.oRepository.oTags[sTag].splice(iIndex, 1);
                            
                            //oThis.fnSelectArticle(oThis.iActiveArticle); 
                            oThis.fnRefreshArticleViewer();
                        })
                        .catch(function(sError)
                        {
                            oThis.$snotify.error(sError);
                            window.oApplication.bShowLoadingScreen = false;
                        });
                }
            );
        },
        fnFindTagsWithArticle: function(sArticle)
        {
            var aResult = [];
            
            for (var sTag in this.oRepository.oTags) {
                var iIndex = this.oRepository.oTags[sTag].indexOf(sArticle);
                
                if (iIndex>-1) {
                    aResult.push(sTag);
                }
            }
            
            return aResult;
        },
        fnCountArticleInTags: function(sArticle)
        {
            return this.fnFindArticleInTags(sArticle).length;
        },
        fnFindArticleInTags: function(sArticle)
        {
            var aResult = [];
            
            for (var sTag in this.oRepository.oTags) {
                if (this.oRepository.oTags[sTag].indexOf(sArticle)!=-1) {
                    aResult.push(sTag);
                }
            }
            
            return aResult;
        },
        fnFindArticleInTag: function(sArticle, sTag)
        {
            console.log('fnFindArticleInTag', sArticle, sTag);
            return this.oRepository.oTags[sTag].indexOf(sArticle);
        },
        fnGetArticlesCountByTagName: function(sTag)
        {
            if (sTag=='__all__') {
                return this.oRepository.aArticles.length;
            }
            
            return this.oRepository.oTags[sTag].length;
        },
        fnSelectTag: function(sTagName, bAddToSelection)
        {
            this.iActiveArticle = -1;
            
            if (bAddToSelection && this.sActiveTag != '__all__') {
                var iIndex = this.aSelectedTags.indexOf(sTagName);
                
                if (iIndex != -1) {
                    this.aSelectedTags.splice(iIndex, 1);
                } else {
                    this.aSelectedTags.push(sTagName);
                }
                
                if (!this.aSelectedTags.length) {
                    return this.fnSelectTag('__all__');
                }
            } else {
                this.sActiveTag = sTagName;
                this.aSelectedTags = [sTagName];
                localStorage.setItem(this.oRepository.sName+'_sActiveTag', sTagName);
            }
            console.log('localStorage.setItem', this.oRepository.sName+'_aSelectedTags', this.aSelectedTags);
            localStorage.setItem(this.oRepository.sName+'_aSelectedTags', JSON.stringify(this.aSelectedTags));
        },
        fnArticleExists: function(iIndex)
        {
            console.log('fnArticleExists', iIndex);
            
            if (typeof iIndex == 'undefined') {
                iIndex = this.iActiveArticle;
            }
            
            return typeof this.aArticles[iIndex] !== 'undefined';
        },
        fnSelectArticleWithName: function(sName, bResetScroll=true)
        {
            console.log('fnSelectArticleWithName', sName);
            
            this.fnSelectArticle(this.aArticles.indexOf(sName));
        },
        fnSelectArticle: function(iIndex, bResetScroll=true)
        {
            console.log('fnSelectArticle', iIndex, this.aArticles[iIndex]);
            
            if (typeof this.aArticles[iIndex] == 'undefined') {
                return;
            }
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'load_article',
                        repository: this.oRepository.sName,
                        article: this.aArticles[iIndex]
                    }
                ).then(function(oResponse)
                {
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    if (bResetScroll) {
                        this.iArticleViewScrollPosition = 0;
                    }
            
                    this.iActiveArticle = iIndex;
                    console.log(this.oRepository.sName+'_iActiveArticle', this.aArticles[iIndex]);
                    localStorage.setItem(this.oRepository.sName+'_iActiveArticle', this.aArticles[iIndex]);
            
                    var oThis = this;
                    
                    setTimeout(
                        function()
                        {
                            oThis.oSimpleMDE.value(oResponse.body.data);
                            oThis.bEditorDirty = false;
                        }, 
                        100
                    );
                    
                    this.fnRefreshArticleViewer();
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                });
        },
        fnArticleViewScroll: function()
        {
            var bIgnoreArticleViewScrollEvents = this.bIgnoreArticleViewScrollEvents;
            this.bIgnoreArticleViewScrollEvents = false;
            this.iArticleViewScrollPosition = this.$refs.article_view_contents.scrollTop;
            
            if (bIgnoreArticleViewScrollEvents) return false;
            
            var oCodeMirror = this.oSimpleMDE.codemirror;
            
            if (this.bLockArticleViewScroll) {
                this.bIgnoreArticleViewScrollEvents = true;
                
                oCodeMirror.display.scroller.scrollTop =
                    this.$refs.article_view_contents.scrollTop 
                        / (this.$refs.article_view_contents.scrollHeight - this.$refs.article_view_contents.clientHeight)
                        * (oCodeMirror.display.scroller.scrollHeight - oCodeMirror.display.scroller.clientHeight);
            }            
        },
        fnRefreshArticleViewer: function()
        {
            this.bShowArticleViewContentsSpinner = true;
            
            var oThis = this;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'get_article_page',
                        repository: this.oRepository.sName,
                        article: this.aArticles[this.iActiveArticle]
                    }
                ).then(function(oResponse)
                {
                    oThis.bShowArticleViewContentsSpinner = false;
                    
                    if (oResponse.body.status=='error') {
                        oThis.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    oThis.sArticleViewContents = oResponse.body.data;
            
                    setTimeout(
                        function()
                        {
                            oThis.$refs.article_view_contents.scrollTop = oThis.iArticleViewScrollPosition;
                            console.log('MathJsx', oThis.$refs.article_view_contents);
                            MathJax.Hub.Queue(["Typeset", MathJax.Hub, oThis.$refs.article_view_contents]);
                        }, 
                        300
                    );
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    oThis.bShowArticleViewContentsSpinner = false;
                });
        },
        fnSearchArticle: function()
        {
            if (this.sArticleFilterString[0]!='%') {
                return;
            }
            
            this.aArticlesSearchResults = [];
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'search_article',
                        repository: this.oRepository.sName,
                        tag: this.sActiveTag,
                        search_text: this.sArticleFilterString.replace(/^%/, '')
                    }
                ).then(function(oResponse)
                {
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    this.aArticlesSearchResults = oResponse.body.data;
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                });
        },
        
        fnInsertImage: function(sURL, bCursorToEnd)
        {
            var cm = this.oSimpleMDE.codemirror;
            var stat = this.fnGetState(cm);
            var options = this.oSimpleMDE.options;
            var url = sURL;
            
            this.fnReplaceSelection(cm, stat.image, options.insertTexts.image, url, bCursorToEnd);
        },
        fnFindImage: function(sName)
        {
            var iLength = this.aImagesModalFiles.length;
            
            for (var iIndex=0; iIndex<iLength; iIndex++) {
                if (this.aImagesModalFiles[iIndex].sName == sName) {
                    return iIndex;
                }
            }
            
            return -1;
        },
        fnUploadImages: function()
        {
            var oFiles = this.$refs.uploaded_images_input.$el.files;

            if (!oFiles.length) {
                return;
            }

            window.oApplication.bShowLoadingScreen = true;
            
            var oFormData = new FormData();

            oFormData.append('action', 'upload_images');
            oFormData.append('repository', this.oRepository.sName);
            
            for (var iIndex=0; iIndex<oFiles.length; iIndex++) {
                oFormData.append('files[]', oFiles[iIndex]);
            }
                        
            this
                .$http
                .post(
                    '',
                    oFormData
                ).then(function(oResponse)
                {                    
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        this.fnUpdateImagesList();
                        return;
                    }
                    
                    if (this.sUploadImagesMode=='update-modal') {
                        for (var iIndex=0; iIndex<oResponse.body.data.length; iIndex++) {
                            var sImage = oResponse.body.data[iIndex];
                            var iIndex = this.fnFindImage(sImage);
                            
                            if (iIndex>-1) {
                                this.aImagesModalFiles.splice(iIndex, 1);
                                this.aImagesModalFiles.push(sImage);
                            } else {
                                this.aImagesModalFiles.push(sImage);
                            }
                        }
                        
                        var iScrollTop = this.$refs.images_modal_list.scrollHeight - this.$refs.images_modal_list.clientHeight;
                        this.$refs.images_modal_list.scrollTop = iScrollTop
                        this.iImagesModalScrollPosition = this.$refs.images_modal_list.scrollTop;

                    } else if (this.sUploadImagesMode=='insert') {
                        for (var iIndex=0; iIndex<oResponse.body.data.length; iIndex++) {
                            this.fnInsertImage('/images/'+oResponse.body.data[iIndex]);
                        }
                    }
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
        },
        fnFileNameEncode: function(sString)
        {
            var aEscapedChars = ['%3A', '%2A',   '%27',   '%2F',   '%3F',   '%60',   '%7C',    '%3C',   '%3E',   '%30',   '%26'];
            var aChars =        [/:/gu, /\*/gu,  /'/gu,   /\//gu,  /\?/gu,  /`/gu,   /\|/gu,   /</gu,   /\>/gu,  /\\/gu,  /"/gu];

            for (var iIndex=0; iIndex<aChars.length; iIndex++) {
                sString = sString.replace(aChars[iIndex], encodeURI(aEscapedChars[iIndex]));
            }
            
            return sString;
        },
        fnShowArticleGithubPage: function()
        {
            var sUser = this.oRepository.sUser;
            var sRepository = this.oRepository.sName;
            var sArticle = this.fnFileNameEncode(this.sActiveArticle);
            var sURL = "https://github.com/"+sUser+"/"+sRepository+"/blob/master/articles/"+sArticle+".md";
            
            var oWindow = window.open(sURL, '_blank');
            oWindow.focus();
        },
        fnShowImagesModal: function()
        {
            this.sUploadImagesMode = 'update-modal';
            this.$refs.images_modal.hideFooter = true;
            this.$refs.images_modal.show();
        },
        fnFindInArray: function(aArray, sSearchString, bCaseSensative=true) 
        { 
            for (var iIndex=0; iIndex<aArray.length; iIndex++) {
                if (!bCaseSensative) {
                    if (aArray[iIndex]
                        .toLowerCase()
                        .indexOf(sSearchString.toLowerCase())!=-1) {
                        return true;
                    }
                } else {
                    if (aArray[iIndex]
                        .indexOf(sSearchString)!=-1) {
                        return true;
                    }
                }
            }

            return false;
        },
        fnImagesFilterCondition: function(oImage, iIndex)
        {
            var oThis = this;
            var sImagesFilterString = oThis.sImagesFilterString.replace(/^%/, '');
            
            return this.sImagesFilterString=='' 
                || (this.sImagesFilterString!='' 
                    && this.sImagesFilterString.indexOf('%')!=0
                    && oImage.sName.indexOf(this.sImagesFilterString)!=-1)
                || (this.sImagesFilterString!='' 
                    && this.sImagesFilterString.indexOf('%')==0
                    && this.fnFindInArray(oImage.aArticles, sImagesFilterString, false));
        },
        fnUpdateImagesList: function()
        {
            var oThis = this;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'get_images',
                        repository: this.oRepository.sName
                    }
                ).then(function(oResponse)
                {
                    if (oResponse.body.status=='error') {
                        oThis.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    oThis.aImagesModalFiles = oResponse.body.data;
                    
                    setTimeout(
                        function()
                        {
                            oThis.$refs.images_modal_list.scrollTop = oThis.iImagesModalScrollPosition;
                        },
                        100
                    );
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                });
        },
        fnResetImagesModal: function()
        {
            this.aImagesModalFiles = [];
            this.aImagesModalSelectedFiles = [];
            this.fnUpdateImagesList();
        },
        fnToggleImageSelection: function(sImage)
        {
            var iIndex = this.aImagesModalSelectedFiles.indexOf(sImage);
            
            if (iIndex==-1) {
                this.aImagesModalSelectedFiles.push(sImage);
            } else {
                this.aImagesModalSelectedFiles.splice(iIndex, 1);
            }
        },
        fnInsertImageFromModal: function()
        {
            for (var iIndex=0; iIndex<this.aImagesModalSelectedFiles.length; iIndex++) {
                this.fnInsertImage('/images/'+this.aImagesModalSelectedFiles[iIndex], true);
            }
            this.$refs.images_modal.hide();
        },
        fnAddImage: function()
        {
            this.$refs.uploaded_images_input.$el.click();
        },
        fnAddImageFromLink: function()
        {
            var sURL = null;
            
            if ((sURL = prompt("Enter URL")) !== null) {
                window.oApplication.bShowLoadingScreen = true;
                
                this
                    .$http
                    .post(
                        '',
                        {
                            action: 'add_images_from_urls',
                            repository: this.oRepository.sName,
                            urls: [sURL]
                        }
                    ).then(function(oResponse)
                    {
                        window.oApplication.bShowLoadingScreen = false;
                        
                        if (oResponse.body.status=='error') {
                            this.$snotify.error(oResponse.body.message, 'Error');
                            return;
                        }

                        var sImage = oResponse.body.data[0]['sFileName'];
                        var iIndex = this.fnFindImage(sImage);
                        
                        if (iIndex>-1) {
                            this.aImagesModalFiles.splice(iIndex, 1);
                            this.aImagesModalFiles.push(sImage);
                        } else {
                            this.aImagesModalFiles.push(sImage);
                        }
                        
                        var iScrollTop = this.$refs.images_modal_list.scrollHeight - this.$refs.images_modal_list.clientHeight;
                        this.$refs.images_modal_list.scrollTop = iScrollTop
                        this.iImagesModalScrollPosition = this.$refs.images_modal_list.scrollTop;
                    })
                    .catch(function(sError)
                    {
                        this.$snotify.error(sError);
                        window.oApplication.bShowLoadingScreen = false;
                    });
            }
        },
        fnRemoveImage: function()
        {
            window.oApplication.bShowLoadingScreen = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'remove_images',
                        repository: this.oRepository.sName,
                        files: this.aImagesModalSelectedFiles
                    }
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    for (var iIndex=0; iIndex<this.aImagesModalSelectedFiles.length; iIndex++) {
                        var iImageIndex = this.fnFindImage(this.aImagesModalSelectedFiles[iIndex]);
                        if (iImageIndex>-1) {
                            this.aImagesModalFiles.splice(iImageIndex, 1);
                        }
                    }
                    
                    this.aImagesModalSelectedFiles = [];
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
        },
        fnImagesModalScroll: function()
        {
            this.iImagesModalScrollPosition = this.$refs.images_modal_list.scrollTop;
        },
        
        fnInsertFile: function(sURL, bCursorToEnd)
        {
            var cm = this.oSimpleMDE.codemirror;
            var stat = this.fnGetState(cm);
            var options = this.oSimpleMDE.options;
            var url = sURL;
            
            this.fnReplaceSelection(cm, stat.link, options.insertTexts.link, url, bCursorToEnd);
        },
        fnUploadFiles: function()
        {
            var oFiles = this.$refs.uploaded_files_input.$el.files;

            if (!oFiles.length) {
                return;
            }
            
            window.oApplication.bShowLoadingScreen = true;

            var oFormData = new FormData();

            oFormData.append('action', 'upload_files');
            oFormData.append('repository', this.oRepository.sName);
            
            for (var iIndex=0; iIndex<oFiles.length; iIndex++) {
                oFormData.append('files[]', oFiles[iIndex]);
            }
                        
            this
                .$http
                .post(
                    '',
                    oFormData
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        this.fnUpdateFilesList();
                        return;
                    }
                    
                    if (this.sUploadFilesMode=='update-modal') {
                        for (var iIndex=0; iIndex<oResponse.body.data.length; iIndex++) {
                            var sFile = oResponse.body.data[iIndex];
                            var iIndex = this.aFilesModalFiles.indexOf(sFile);
                            
                            if (iIndex>-1) {
                                this.aFilesModalFiles.splice(iIndex, 1);
                                this.aFilesModalFiles.push(sFile);
                            } else {
                                this.aFilesModalFiles.push(sFile);
                            }                            
                        }
                        
                        var iScrollTop = this.$refs.files_modal_list.scrollHeight - this.$refs.files_modal_list.clientHeight;
                        this.$refs.files_modal_list.scrollTop = iScrollTop
                        this.iFilesModalScrollPosition = this.$refs.files_modal_list.scrollTop;
                        
                    } else if (this.sUploadFilesMode=='insert') {
                        for (var iIndex=0; iIndex<oResponse.body.data.length; iIndex++) {
                            this.fnInsertFile('/files/'+oResponse.body.data[iIndex]);
                        }
                    }
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
        },
        fnShowFilesModal: function()
        {
            this.sUploadFilesMode = 'update-modal';
            this.$refs.files_modal.hideFooter = true;
            this.$refs.files_modal.show();
        },
        fnUpdateFilesList: function()
        {
            var oThis = this;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'get_files',
                        repository: this.oRepository.sName
                    }
                ).then(function(oResponse)
                {
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    this.aFilesModalFiles = oResponse.body.data;

                    setTimeout(
                        function()
                        {
                            oThis.$refs.files_modal_list.scrollTop = oThis.iFilesModalScrollPosition;
                        },
                        100
                    );
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                });
        },
        fnResetFilesModal: function()
        {
            this.aFilesModalFiles = [];
            this.aFilesModalSelectedFiles = [];
            this.fnUpdateFilesList();
        },
        fnToggleFileSelection: function(sFile)
        {
            var iIndex = this.aFilesModalSelectedFiles.indexOf(sFile);
            
            if (iIndex==-1) {
                this.aFilesModalSelectedFiles.push(sFile);
            } else {
                this.aFilesModalSelectedFiles.splice(iIndex, 1);
            }
        },
        fnInsertFileFromModal: function()
        {
            for (var iIndex=0; iIndex<this.aFilesModalSelectedFiles.length; iIndex++) {
                this.fnInsertFile('/files/'+this.aFilesModalSelectedFiles[iIndex], true);
            }
            this.$refs.files_modal.hide();
        },
        fnAddFile: function()
        {
            this.$refs.uploaded_files_input.$el.click();
        },
        fnAddFileFromLink: function()
        {
            var sURL = null;
            
            if ((sURL = prompt("Enter URL")) !== null) {
                window.oApplication.bShowLoadingScreen = true;
                
                this
                    .$http
                    .post(
                        '',
                        {
                            action: 'add_files_from_urls',
                            repository: this.oRepository.sName,
                            urls: [sURL]
                        }
                    ).then(function(oResponse)
                    {
                        window.oApplication.bShowLoadingScreen = false;
                        
                        if (oResponse.body.status=='error') {
                            this.$snotify.error(oResponse.body.message, 'Error');
                            return;
                        }

                        var sFile = oResponse.body.data[0];
                        var iIndex = this.aFilesModalFiles.indexOf(sFile);
                        
                        if (iIndex>-1) {
                            this.aFilesModalFiles.splice(iIndex, 1);
                            this.aFilesModalFiles.push(sFile);
                        } else {
                            this.aFilesModalFiles.push(sFile);
                        }
                        
                        var iScrollTop = this.$refs.files_modal_list.scrollHeight - this.$refs.files_modal_list.clientHeight;
                        this.$refs.files_modal_list.scrollTop = iScrollTop
                        this.iFilesModalScrollPosition = this.$refs.files_modal_list.scrollTop;
                    })
                    .catch(function(sError)
                    {
                        this.$snotify.error(sError);
                        window.oApplication.bShowLoadingScreen = false;
                    });
            }            
        },
        fnRemoveFile: function()
        {
            window.oApplication.bShowLoadingScreen = true;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'remove_files',
                        repository: this.oRepository.sName,
                        files: this.aFilesModalSelectedFiles
                    }
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;
                    
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    for (var iIndex=0; iIndex<this.aFilesModalSelectedFiles.length; iIndex++) {
                        var iFileIndex = this.aFilesModalFiles.indexOf(this.aFilesModalSelectedFiles[iIndex]);
                        if (iFileIndex>-1) {
                            this.aFilesModalFiles.splice(iFileIndex, 1);
                        }
                    }
                    
                    this.aFilesModalSelectedFiles = [];
                })
                .catch(function(sError)
                {
                    this.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
        },
        fnFilesModalScroll: function()
        {
            this.iFilesModalScrollPosition = this.$refs.files_modal_list.scrollTop;
        },
        
        fnShowMathJaxModal: function()
        {
            this.$refs.mathjax_modal.hideFooter = true;
            this.$refs.mathjax_modal.show();        
        },
        fnResetMathJaxModal: function()
        {
            
        },
        fnInsertMathJaxFromModal: function()
        {
            var oThis = this;
            
            var aEscapes = [
                [/\\/g, '\\\\'],
                [/\*/g, '\\*'],
                [/^-/g, '\\-'],
                [/^\+ /g, '\\+ '],
                [/^(=+)/g, '\\$1'],
                [/^(#{1,6}) /g, '\\$1 '],
                [/`/g, '\\`'],
                [/^~~~/g, '\\~~~'],
                [/\[/g, '\\['],
                [/\]/g, '\\]'],
                [/^</g, '\\<'],
                [/^>/g, '\\>'],
                [/~/g, '\\~'],
                [/_/g, '\\_'],
                [/^(\d+)\. /g, '$1\\. ']
            ];
            
            var sFormula = oThis.sMathJaxFormula;
            
            sFormula = aEscapes.reduce(function (sAccumulator, aEscape) {
                return sAccumulator.replace(aEscape[0], aEscape[1])
            }, sFormula);
            
            var oCodeMirror = oThis.oSimpleMDE.codemirror;
            oCodeMirror.replaceSelection(sFormula);
            
            /*
            var oSVG = this.$refs.mathjax_formula.$el.querySelector('svg');
            
            if (!oSVG) {
                return;
            }
            
            var oSerializer = new XMLSerializer();
            var sSource = oSerializer.serializeToString(oSVG);

            //add name spaces.
            if(!sSource.match(/^<svg[^>]+xmlns="http\:\/\/www\.w3\.org\/2000\/svg"/)){
                sSource = sSource.replace(/^<svg/, '<svg xmlns="http://www.w3.org/2000/svg"');
            }
            if(!sSource.match(/^<svg[^>]+"http\:\/\/www\.w3\.org\/1999\/xlink"/)){
                sSource = sSource.replace(/^<svg/, '<svg xmlns:xlink="http://www.w3.org/1999/xlink"');
            }

            //add xml declaration
            sSource = '<?xml version="1.0" standalone="no"?>\r\n' + sSource;
            
            var oBlob = new Blob([sSource], {type: "image/svg+xml"});
            
            window.oApplication.bShowLoadingScreen = true;

            var oFormData = new FormData();

            oFormData.append('action', 'upload_images');
            oFormData.append('repository', oThis.oRepository.sName);
            oFormData.append('pasted_files[]', oBlob);

            oThis
                .$http
                .post(
                    '',
                    oFormData
                ).then(function(oResponse)
                {
                    window.oApplication.bShowLoadingScreen = false;

                    if (oResponse.body.status=='error') {
                        oThis.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }

                    var oCodeMirror = oThis.oSimpleMDE.codemirror;

                    oCodeMirror.replaceSelection('![](/images/'+oResponse.body.data[0]+')');
                })
                .catch(function(sError)
                {
                    oThis.$snotify.error(sError);
                    window.oApplication.bShowLoadingScreen = false;
                });
            */
        },
        
        fnShowDiffModal: function()
        {
            console.log('fnShowDiffModal');
            this.$refs.diff_modal.hideFooter = true;
            this.$refs.diff_modal.show();
        },
        fnReplaceSymbol(sSymbol, sReplaceText, sSearchText, sText)
        {
            var iIndex = 0;
            
            while (iIndex<sSearchText.length) {
                iIndex = sSearchText.indexOf(sSymbol, iIndex+1);

                if (iIndex==-1)
                    break;
                
                sText = sText.substring(0, iIndex) 
                    + sReplaceText
                    + sText.substring(iIndex+1, sText.length-1);
            }
            
            return sText;
        },
        fnFindDiff: function()
        {
            var oElement1 = this.$refs.diff_modal_column_1;
            var oElement2 = this.$refs.diff_modal_column_2;
            
            this.bEnableDiffEditor1 = false;
            this.bEnableDiffEditor2 = false;
            
            this.sDiffText1 = oElement1.innerText;
            this.sDiffText2 = oElement2.innerText;
            
            var oDiff = Diff[this.sDiffMethod](this.sDiffText1, this.sDiffText2);
            
            oElement1.innerHTML = '';
            oElement2.innerHTML = '';
            
            this.iDiffRemovals = 0;
            this.iDiffAdditions = 0;
            
            var oThis = this;
            
            oDiff.forEach(function(oPart) 
            {
                var sRed = 'rgb(255, 137, 131)';
                var sGreen = 'rgb(107, 223, 184)';
                var color1 = oPart.added ? sGreen : oPart.removed ? sRed : 'none';
                var color2 = oPart.added ? sRed : oPart.removed ? sGreen : 'none';
                
                if (oPart.removed) {
                    oThis.iDiffRemovals++;
                }
                if (oPart.added) {
                    oThis.iDiffAdditions++;
                }
                
                var oSpan = document.createElement('span');
                oSpan.style.backgroundColor = color1;
                oSpan.style.wordBreak = 'break-all';
                if (oPart.added) {
                    var sText = ' '.repeat(oPart.value.length)
                    sText = oThis.fnReplaceSymbol("\n", "\n", oPart.value, sText);
                    sText = oThis.fnReplaceSymbol("\r", "\r", oPart.value, sText);
                    sText = sText.replace(/ /g, "&emsp;");
                    sText = sText.replace(/\n/g, "<br>");
                    sText = sText.replace(/\r/g, "");
                    
                    oSpan.innerHTML = sText;
                } else {
                    oSpan.innerText = oPart.value;
                }
                oElement1.appendChild(oSpan);
                
                oSpan = document.createElement('span');
                oSpan.style.backgroundColor = color2;
                oSpan.style.wordBreak = 'break-all';
                if (oPart.removed) {
                    var sText = ' '.repeat(oPart.value.length)
                    sText = oThis.fnReplaceSymbol("\n", "\n", oPart.value, sText);
                    sText = oThis.fnReplaceSymbol("\r", "\r", oPart.value, sText);
                    sText = sText.replace(/ /g, "&emsp;");
                    sText = sText.replace(/\n/g, "<br>");
                    sText = sText.replace(/\r/g, "");
                    
                    oSpan.innerHTML = sText;
                } else {
                    oSpan.innerText = oPart.value;
                }
                oElement2.appendChild(oSpan);
            });
            
            this.sDiffEditor1HTML = oElement1.innerHTML;
            this.sDiffEditor2HTML = oElement2.innerHTML;
        },        
        fnResetDiff: function() {
            var oElement1 = this.$refs.diff_modal_column_1;
            var oElement2 = this.$refs.diff_modal_column_2;
            
            oElement1.innerText = this.sDiffText1;
            oElement2.innerText = this.sDiffText2;

            this.bEnableDiffEditor1 = true;
            this.bEnableDiffEditor2 = true;            
        },
        fnDiffEditor1Scroll: function()
        {
            var bIgnoreDiffScrollEvents = this.bIgnoreDiffScrollEvents;
            this.bIgnoreDiffScrollEvents = false;
            if (bIgnoreDiffScrollEvents) return false;
            
            var oElement1 = this.$refs.diff_modal_column_1;
            var oElement2 = this.$refs.diff_modal_column_2;
            
            this.bIgnoreDiffScrollEvents = true;
            
            oElement2.scrollTop = oElement1.scrollTop/(oElement1.scrollHeight - oElement1.clientHeight)*(oElement2.scrollHeight - oElement2.clientHeight);
        },
        fnDiffEditor2Scroll: function()
        {
            var bIgnoreDiffScrollEvents = this.bIgnoreDiffScrollEvents;
            this.bIgnoreDiffScrollEvents = false;
            if (bIgnoreDiffScrollEvents) return false;
            
            var oElement1 = this.$refs.diff_modal_column_1;
            var oElement2 = this.$refs.diff_modal_column_2;
            
            this.bIgnoreDiffScrollEvents = true;
            
            oElement1.scrollTop = oElement2.scrollTop/(oElement2.scrollHeight - oElement2.clientHeight)*(oElement1.scrollHeight - oElement1.clientHeight);
        },
        fnInsertAtCursor: function(sText)
        {
            var oSelection, oRange;
            
            if (window.getSelection) {
                oSelection = window.getSelection();
                if (oSelection.getRangeAt && oSelection.rangeCount) {
                    oRange = oSelection.getRangeAt(0);
                    oRange.deleteContents();
                    var oSpan = document.createElement('span');
                    oSpan.innerText = sText;
                    oRange.insertNode(oSpan);
                }
            } else if (document.selection && document.selection.createRange) {
                document.selection.createRange().text = sText;
            }
        },
        fnDiffEditor1Paste: function(oEvent)
        {
            var oClipboardData = (oEvent.originalEvent || oEvent).clipboardData;
            
            if (oClipboardData.types.indexOf('text/html') > -1) {
                oEvent.preventDefault();

                var oElement1 = this.$refs.diff_modal_column_1;

                this.fnInsertAtCursor(oClipboardData.getData('text/plain'));
                //oElement1.innerText = oClipboardData.getData('text/plain');
            }
        },
        fnDiffEditor2Paste: function(oEvent)
        {
            var oClipboardData = (oEvent.originalEvent || oEvent).clipboardData;
            
            if (oClipboardData.types.indexOf('text/html') > -1) {
                oEvent.preventDefault();

                var oElement2 = this.$refs.diff_modal_column_2;

                this.fnInsertAtCursor(oClipboardData.getData('text/plain'));
                //oElement2.innerText = oClipboardData.getData('text/plain');
            }
        },
        
        fnAddYoutubeVideo: function()
        {
            var sHash = /http:/.test(this.sYoutubeVideoURL) ? this.fnGetYoutubeHash(this.sYoutubeVideoURL) : this.sYoutubeVideoURL;
            
            this.fnInsertFile("http://www.youtube.com/watch?v="+sHash);
            this.fnInsertImage("http://img.youtube.com/vi/"+sHash+"/0.jpg");
        },
        fnGetYoutubeHash: function(sURL)
        {
            var aResult = sURL.match(/http:\/\/www\.youtube\.com\/watch\?v=(\w+)/);
            
            return aResult[1];
        },
        
        fnClearSearch: function()
        {
            var oCodeMirror = this.oSimpleMDE.codemirror;
            var oThis = this;
            
            oCodeMirror.operation(function() 
            {
                oThis.sSearchLastQuery = oThis.sSearchQuery;
                if (!oThis.sSearchQuery) return;
                
                oCodeMirror.removeOverlay(oThis.oSearchOverlay);
                
                if (oThis.oSearchAnnotate) { 
                    oThis.oSearchAnnotate.clear(); 
                    oThis.oSearchAnnotate = null; 
                }
            });
        },
        fnQueryCaseInsensitive: function(sQuery) {
            return typeof sQuery == "string" && sQuery == sQuery.toLowerCase();
        },
        fnGetSearchCursor: function(oCodeMirror, sQuery, iPos) {
            return oCodeMirror.getSearchCursor(sQuery, iPos, {caseFold: this.fnQueryCaseInsensitive(sQuery), multiline: true});
        },
        fnFindNext: function()
        {
            this.fnEditorDoSearch();
        },
        fnFindPrevious: function()
        {
            this.fnEditorDoSearch(true);
        },
        fnEditorDoSearch: function(bRev, persistent, immediate) 
        {
            if (this.sSearchQuery) 
                return this.fnEditorFindNext(bRev);
        },
        fnEditorFindNext: function(bRev, fnCallback)
        {
            var oThis = this;
            
            var CodeMirror = this.oSimpleMDE.CodeMirror;
            var oCodeMirror = this.oSimpleMDE.codemirror;
            
            oCodeMirror.operation(function() 
            {
                var oCursor = oThis.fnGetSearchCursor(
                    oCodeMirror, 
                    oThis.sSearchQuery, 
                    bRev ? oThis.iSearchPosFrom : oThis.iSearchPosTo
                );
                
                if (!oCursor.find(bRev)) {
                    oCursor = oThis.fnGetSearchCursor(
                        oCodeMirror, 
                        oThis.sSearchQuery, 
                        bRev ? CodeMirror.Pos(oCodeMirror.lastLine()) : CodeMirror.Pos(oCodeMirror.firstLine(), 0)
                    );
                    if (!oCursor.find(bRev)) return;
                }
                
                oCodeMirror.setSelection(oCursor.from(), oCursor.to());
                oCodeMirror.scrollIntoView({from: oCursor.from(), to: oCursor.to()}, 20);
                
                oThis.iSearchPosFrom = oCursor.from(); 
                oThis.iSearchPosTo = oCursor.to();
                
                if (fnCallback) fnCallback(oCursor.from(), oCursor.to())
            });            
        },
        fnPrepareQuery: function(sQuery)
        {
            if (!this.bUseRegularExpression) {
                sQuery = sQuery.replace(/(\.|\[|\]|\(|\)|\*|\?|\\|\+|\{|\})/g, "\\$1");
            }
            
            var oRegExp;
            
            try {
                oRegExp = new RegExp(sQuery, this.bUseCaseSensetive ? "u" : "ui");
            } catch(oException) {
                this.$snotify.error('Wrong regular expression');
                return "";
            }
            
            return oRegExp;
        },
        fnReplace: function()
        {
            this.fnEditorReplace();            
        },
        fnReplaceAll: function()
        {
            this.fnEditorReplace(true);
        },
        fnEditorReplaceAll: function(mQuery, sText)
        {
            var oCodeMirror = this.oSimpleMDE.codemirror;
            var oThis = this;
            
            oCodeMirror.operation(function() 
            {
                for (var oCursor = oThis.fnGetSearchCursor(oCodeMirror, mQuery); oCursor.findNext();) {
                    if (typeof mQuery != "string") {
                        var oMatch = oCodeMirror.getRange(oCursor.from(), oCursor.to()).match(mQuery);
                        oCursor.replace(sText.replace(/\$(\d)/g, function(_, i) {return oMatch[i];}));
                    } else 
                        oCursor.replace(sText);
                }
            });
        },
        fnEditorReplace: function(bAll)
        {
            var oCodeMirror = this.oSimpleMDE.codemirror;
            var oThis = this;
            
            if (oCodeMirror.getOption("readOnly")) return;
            
            //var query = oCodeMirror.getSelection() || getSearchState(cm).lastQuery;
            var mQuery = this.fnPrepareQuery(this.sSearchQuery);

            if (this.bSearchInSelection) {
                var sSelection = oCodeMirror.getSelection();
                var sText = this.sSearchQueryText;
                
                if (bAll) {
                    mQuery = new RegExp(mQuery.source, "uig");
                }
                
                sSelection = sSelection.replace(mQuery, sText);
                
                oCodeMirror.replaceSelection(sSelection);
                
                return;
            }

            if (bAll) {
                this.fnEditorReplaceAll(mQuery, this.sSearchQueryText);
            } else {
                this.fnClearSearch();
                
                var oCursor = this.fnGetSearchCursor(oCodeMirror, mQuery, oCodeMirror.getCursor("from"));
                
                var fnAdvance = function() 
                {
                    var oStart = oCursor.from(), oMatch;
                    
                    if (!(oMatch = oCursor.findNext())) {
                        oCursor = oThis.fnGetSearchCursor(oCodeMirror, mQuery);
                        if (!(oMatch = oCursor.findNext()) 
                            || (oStart 
                                && oCursor.from().line == oStart.line 
                                && oCursor.from().ch == oStart.ch
                               )
                           ) 
                            return;
                    }
                    
                    oCodeMirror.setSelection(oCursor.from(), oCursor.to());
                    oCodeMirror.scrollIntoView({from: oCursor.from(), to: oCursor.to()});
                    
                    //this.replaceAll(mQuery, this.sSearchQueryText);
                    oCursor.replace(
                        typeof mQuery == "string" ? 
                        oThis.sSearchQueryText :
                        oThis.sSearchQueryText.replace(/\$(\d)/g, function(_, i) {return oMatch[i];})
                    );
                    //fnAdvance();
                };
                fnAdvance();
            }
        },
        fnShowRegExpHelp: function()
        {
            this.$refs.help_modal.show();
        },
        
        fnTranslate: function()
        {
            var oCodeMirror = this.oSimpleMDE.codemirror;
            var oThis = this;
            
            if (oCodeMirror.getOption("readOnly")) return;
            
            this
                .$http
                .post(
                    '',
                    {
                        action: 'translate_text',
                        provider: this.sTranslationProvider,
                        text: oCodeMirror.getSelection(),
                        from_laguage: this.sTranslationFromLanguage,
                        to_language: this.sTranslationToLanguage
                    }
                ).then(function(oResponse)
                {
                    if (oResponse.body.status=='error') {
                        this.$snotify.error(oResponse.body.message, 'Error');
                        return;
                    }
                    
                    oCodeMirror.replaceSelection(oResponse.body.data);
                }).catch(function(sError)
                {
                    this.$snotify.error(sError);
                });
        },
        fnTranslationProviderChange: function(sValue)
        {
            localStorage.setItem(this.oRepository.sName+'_sTranslationProvider', sValue);
        },
        fnTranslationFromLanguageChange: function(sValue)
        {
            localStorage.setItem(this.oRepository.sName+'_sTranslationFromLanguage', sValue);
        },
        fnTranslationToLanguageChange: function(sValue)
        {
            localStorage.setItem(this.oRepository.sName+'_sTranslationToLanguage', sValue);
        },
                
        fnGetState: function (cm, pos) 
        {
            pos = pos || cm.getCursor("start");
            var stat = cm.getTokenAt(pos);
            if(!stat.type) return {};

            var types = stat.type.split(" ");

            var ret = {},
                data, text;
            for(var i = 0; i < types.length; i++) {
                data = types[i];
                if(data === "strong") {
                    ret.bold = true;
                } else if(data === "variable-2") {
                    text = cm.getLine(pos.line);
                    if(/^\s*\d+\.\s/.test(text)) {
                        ret["ordered-list"] = true;
                    } else {
                        ret["unordered-list"] = true;
                    }
                } else if(data === "atom") {
                    ret.quote = true;
                } else if(data === "em") {
                    ret.italic = true;
                } else if(data === "quote") {
                    ret.quote = true;
                } else if(data === "strikethrough") {
                    ret.strikethrough = true;
                } else if(data === "comment") {
                    ret.code = true;
                } else if(data === "link") {
                    ret.link = true;
                } else if(data === "tag") {
                    ret.image = true;
                } else if(data.match(/^header(\-[1-6])?$/)) {
                    ret[data.replace("header", "heading")] = true;
                }
            }
            return ret;
        },
        fnReplaceSelection: function (cm, active, startEnd, url, bCursorToEnd) 
        {
            if(/editor-preview-active/.test(cm.getWrapperElement().lastChild.className))
                return;

            var text;
            var start = startEnd[0];
            var end = startEnd[1];
            var startPoint = cm.getCursor("start");
            var endPoint = cm.getCursor("end");
            if(url) {
                end = end.replace("#url#", url);
            }
            if(active) {
                text = cm.getLine(startPoint.line);
                start = text.slice(0, startPoint.ch);
                end = text.slice(startPoint.ch);
                cm.replaceRange(start + end, {
                    line: startPoint.line,
                    ch: 0
                });
            } else {
                text = cm.getSelection();
                cm.replaceSelection(start + text + end);

                startPoint.ch += start.length;
                if(startPoint !== endPoint) {
                    endPoint.ch += start.length;
                }
            }
            cm.setSelection(startPoint, endPoint);
            
            if (bCursorToEnd) {
                var oCursorPosition = cm.getCursor(); 
                oCursorPosition.ch += url.length+end.length;
                cm.setCursor(oCursorPosition);
                cm.focus();
            }
        }
    },
    
    updated: function()
    {
        var oThis = this;
        
        Vue.nextTick(function() 
        {
            
        });
    },
   
    mounted: function()
    {
        console.log('tab mounted', this.oRepository, this.bActive);
        
        var oThis = this;
        
        for (var sKey in oThis.oRepository.oSettings) {
            oThis.oSettings[sKey] = oThis.oRepository.oSettings[sKey];
        }
        
        this.oSimpleMDE = new SimpleMDE({ 
            autoDownloadFontAwesome: false,
            element: this.$el.querySelector('.page-content-textarea'),
            toolbar: [
                "bold",
                "italic",
                "strikethrough",
                "heading",
                "heading-smaller",
                "heading-bigger",
                "heading-1",
                "heading-2",
                "heading-3",
                "code",
                "quote",
                "unordered-list",
                "ordered-list",
                "clean-block",
                "link",
                "image",
                "table",
                "horizontal-rule",
                "preview",
                "side-by-side",
                "fullscreen",
                {
                    name: "insert-picture",
                    action: function customFunction(oEditor)
                    {
                        oThis.sUploadImagesMode = 'insert';
                        oThis.$refs.uploaded_images_input.$el.click();
                    },
                    className: "fa fa-file-image-o",
                    title: "Insert local picture"
                },
                {
                    name: "insert-picture-from-collection",
                    action: function(oEditor)
                    {
                        oThis.sUploadImagesMode = 'update-modal';
                        oThis.$refs.images_modal.hideFooter = false;
                        oThis.$refs.images_modal.show();
                    },
                    className: "fa fa-picture-o",
                    title: "Insert local picture"
                },
                {
                    name: "insert-files-from-collection",
                    action: function(oEditor)
                    {
                        oThis.sUploadFilesMode = 'update-modal';
                        oThis.$refs.files_modal.hideFooter = false;
                        oThis.$refs.files_modal.show();
                    },
                    className: "fa fa-file-o",
                    title: "Insert file from collection"
                },
                {
                    name: "insert-youtube-video",
                    action: function(oEditor)
                    {
                        oThis.sYoutubeVideoURL = '';
                        oThis.$refs.add_youtube_video_modal.hideFooter = false;
                        oThis.$refs.add_youtube_video_modal.show();
                    },
                    className: "fa fa-youtube-play",
                    title: "Insert youtube video"
                },
                {
                    name: "replace-text",
                    action: function(oEditor)
                    {
                        var oCodeMirror = oThis.oSimpleMDE.codemirror;
                        
                        if (!oThis.bShowReplacementBlock) {
                            oThis.sSearchQuery = oCodeMirror.getSelection();
                        }
                        
                        var oToolbarButton = oEditor.toolbarElements["replace-text"];
                        
                        if (oThis.bShowReplacementBlock) {
                            oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");
                        } else {
                            oToolbarButton.className += " active";
                        }

                        oToolbarButton = oEditor.toolbarElements["translate-text"];
                        oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");
                                
                        oThis.bShowTranslationBlock = false;
                        oThis.bShowReplacementBlock = !oThis.bShowReplacementBlock;
                        
                        setTimeout(
                            function()
                            {
                                if (oThis.$refs.replacable_text_input.$el) {
                                    oThis.$refs.replacable_text_input.$el.focus();
                                }
                            }, 
                            300
                        );
                    },
                    className: "fa fa-refresh",
                    title: "Replace text"
                },
                {
                    name: "translate-text",
                    action: function(oEditor)
                    {
                        var oToolbarButton = oEditor.toolbarElements["translate-text"];
                        
                        if (oThis.bShowTranslationBlock) {
                            oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");
                        } else {
                            oToolbarButton.className += " active";
                        }
                        
                        oToolbarButton = oEditor.toolbarElements["replace-text"];
                        oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");
                        
                        oThis.bShowReplacementBlock = false;
                        oThis.bShowTranslationBlock = !oThis.bShowTranslationBlock;
                    },
                    className: "fa fa-language",
                    title: "Translate text"
                },
                {
                    name: "save",
                    action: function(oEditor)
                    {
                        oThis.fnPushRepository();
                    },
                    className: "fa fa-save",
                    title: "Save"
                },
                {
                    name: "paste-as-text",
                    action: function(oEditor)
                    {
                        var oToolbarButton = oEditor.toolbarElements["paste-as-text"];
                        
                        if (oThis.bPasteAsText) {
                            oToolbarButton.className = oToolbarButton.className.replace(/\s*active\s*/g, "");
                        } else {
                            oToolbarButton.className += " active";
                        }
                        
                        oThis.bPasteAsText = !oThis.bPasteAsText;                        
                    },
                    className: "fa fa-bars",
                    title: "Paste as text"
                },
                {
                    name: "paste-collapsable-block",
                    action: function(oEditor)
                    {
                        var oCodeMirror = oThis.oSimpleMDE.codemirror;
                        var sSelection = oCodeMirror.getSelection();
                        
                        oCodeMirror.replaceSelection(                        
"\
<details><summary>   </summary>\n\
\n\
"+sSelection+"\n\
\n\
</details>\n\
"
                        );
                    },
                    className: "fa fa-outdent",
                    title: "Insert collapsable block"
                },
                {
                    name: "insert-math",
                    action: function(oEditor)
                    {
                        oThis.$refs.mathjax_modal.hideFooter = false;
                        oThis.$refs.mathjax_modal.show();                       
                    },
                    className: "fa fa-times-rectangle-o",
                    title: "Insert math formula"
                },
            ]
        });
        
        var oExtraKeys = this.oSimpleMDE.codemirror.getOption("extraKeys");
        oExtraKeys["Ctrl-S"] = function() { oThis.fnPushRepository(); };
        this.oSimpleMDE.codemirror.setOption("extraKeys", oExtraKeys);
        
        this.oSimpleMDE.codemirror.on(
            'change', 
            function(oCodeMirror) 
            {
                console.log('codemirror - onchange');
                oThis.bEditorDirty = true;
            }
        );
        
        this.oSimpleMDE.codemirror.on(
            'scroll', 
            function(oCodeMirror, oEvent) 
            {
                //console.log('codemirror - onscroll');
                var bIgnoreArticleViewScrollEvents = oThis.bIgnoreArticleViewScrollEvents;
                oThis.bIgnoreArticleViewScrollEvents = false;
                if (bIgnoreArticleViewScrollEvents) return false;

                if (oThis.bLockArticleViewScroll) {
                    oThis.bIgnoreArticleViewScrollEvents = true;

                    oThis.$refs.article_view_contents.scrollTop = 
                        oCodeMirror.display.scroller.scrollTop
                            / (oCodeMirror.display.scroller.scrollHeight - oCodeMirror.display.scroller.clientHeight)
                            * (oThis.$refs.article_view_contents.scrollHeight - oThis.$refs.article_view_contents.clientHeight);
                }
            }
        );
        
        this.oSimpleMDE.codemirror.on(
            'paste', 
            function(oCodeMirror, oEvent) 
            {
                console.log('codemirror - paste');

                var oClipboardData = (oEvent.clipboardData || window.clipboardData);

                for (var iIndex in oClipboardData.items)
                {
                    var oItem = oClipboardData.items[iIndex];

                    if (oItem.kind == 'file') {
                        window.oApplication.bShowLoadingScreen = true;

                        var oFile = oItem.getAsFile();

                        var oFormData = new FormData();

                        oFormData.append('action', 'upload_images');
                        oFormData.append('repository', oThis.oRepository.sName);
                        oFormData.append('pasted_files[]', oFile);

                        oThis
                            .$http
                            .post(
                                '',
                                oFormData
                            ).then(function(oResponse)
                            {
                                window.oApplication.bShowLoadingScreen = false;

                                if (oResponse.body.status=='error') {
                                    oThis.$snotify.error(oResponse.body.message, 'Error');
                                    return;
                                }

                                oCodeMirror.replaceSelection('![](/images/'+oResponse.body.data[0]+')');
                            })
                            .catch(function(sError)
                            {
                                oThis.$snotify.error(sError);
                                window.oApplication.bShowLoadingScreen = false;
                            });

                        return;
                    }
                }

                if (oThis.bPasteAsText) {
                    var sText = oClipboardData.getData('text/plain');
                    oCodeMirror.replaceSelection(sText);

                    oEvent.preventDefault();

                    return;
                }

                if (oClipboardData.types.indexOf('text/html') == -1) 
                    return;

                var sText = oTurndownService.turndown(oClipboardData.getData('text/html'));

                var oLinksMatch;
                var oURLMatch;

                if ((oLinksMatch = sText.match(/!\[[^\]]*\]\([^)]*\)/gu)) !== null) {
                    var aURLs = [];

                    for (var iIndex=0; iIndex<oLinksMatch.length; iIndex++) {
                        if ((oURLMatch = oLinksMatch[iIndex].match(/\((https?:.*?)(\s+["'].*?["'])?\)/u)) !== null) {
                            aURLs.push(oURLMatch[1]);
                        }
                    }

                    window.oApplication.bShowLoadingScreen = true;

                    oThis
                        .$http
                        .post(
                            '',
                            {
                                action: 'add_images_from_urls',
                                repository: oThis.oRepository.sName,
                                urls: aURLs
                            }
                        ).then(function(oResponse)
                        {
                            window.oApplication.bShowLoadingScreen = false;

                            if (oResponse.body.status=='error') {
                                oThis.$snotify.error(oResponse.body.message, 'Error');
                                return;
                            }

                            for (var iDataIndex=0; iDataIndex<oResponse.body.data.length; iDataIndex++) {
                                for (var iIndex=0; iIndex<oLinksMatch.length; iIndex++) {
                                    if (oLinksMatch[iIndex].indexOf(oResponse.body.data[iDataIndex]['sURL']) !== -1) {
                                        var sNewLink = oLinksMatch[iIndex].replace(/\(https?:.*?\)/u, "(/images/"+oResponse.body.data[iDataIndex]['sFileName']+")");
                                        sText = sText.replace(oLinksMatch[iIndex], sNewLink);
                                        break;
                                    }
                                }
                            }

                            oCodeMirror.replaceSelection(sText);
                        })
                        .catch(function(sError)
                        {
                            oThis.$snotify.error(sError);
                            window.oApplication.bShowLoadingScreen = false;
                        });
                } else {
                    oCodeMirror.replaceSelection(sText);
                }

                oEvent.preventDefault();
            }
        );
        
        (function(CodeMirror) 
        {
            var Pos = CodeMirror.Pos;
                
              function regexpFlags(regexp) {
                var flags = regexp.flags
                return flags != null ? flags : (regexp.ignoreCase ? "i" : "")
                  + (regexp.global ? "g" : "")
                  + (regexp.multiline ? "m" : "")
              }

              function ensureFlags(regexp, flags) {
                var current = regexpFlags(regexp), target = current
                for (var i = 0; i < flags.length; i++) if (target.indexOf(flags.charAt(i)) == -1)
                  target += flags.charAt(i)
                return current == target ? regexp : new RegExp(regexp.source, target)
              }

              function maybeMultiline(regexp) {
                return /\\s|\\n|\n|\\W|\\D|\[\^/.test(regexp.source)
              }

              function searchRegexpForward(doc, regexp, start) {
                regexp = ensureFlags(regexp, "g")
                for (var line = start.line, ch = start.ch, last = doc.lastLine(); line <= last; line++, ch = 0) {
                  regexp.lastIndex = ch
                  var string = doc.getLine(line), match = regexp.exec(string)
                  if (match)
                    return {from: Pos(line, match.index),
                            to: Pos(line, match.index + match[0].length),
                            match: match}
                }
              }

              function searchRegexpForwardMultiline(doc, regexp, start) {
                if (!maybeMultiline(regexp)) return searchRegexpForward(doc, regexp, start)

                regexp = ensureFlags(regexp, "gm")
                var string, chunk = 1
                for (var line = start.line, last = doc.lastLine(); line <= last;) {
                  // This grows the search buffer in exponentially-sized chunks
                  // between matches, so that nearby matches are fast and don't
                  // require concatenating the whole document (in case we're
                  // searching for something that has tons of matches), but at the
                  // same time, the amount of retries is limited.
                  for (var i = 0; i < chunk; i++) {
                    if (line > last) break
                    var curLine = doc.getLine(line++)
                    string = string == null ? curLine : string + "\n" + curLine
                  }
                  chunk = chunk * 2
                  regexp.lastIndex = start.ch
                  var match = regexp.exec(string)
                  if (match) {
                    var before = string.slice(0, match.index).split("\n"), inside = match[0].split("\n")
                    var startLine = start.line + before.length - 1, startCh = before[before.length - 1].length
                    return {from: Pos(startLine, startCh),
                            to: Pos(startLine + inside.length - 1,
                                    inside.length == 1 ? startCh + inside[0].length : inside[inside.length - 1].length),
                            match: match}
                  }
                }
              }

              function lastMatchIn(string, regexp) {
                var cutOff = 0, match
                for (;;) {
                  regexp.lastIndex = cutOff
                  var newMatch = regexp.exec(string)
                  if (!newMatch) return match
                  match = newMatch
                  cutOff = match.index + (match[0].length || 1)
                  if (cutOff == string.length) return match
                }
              }

              function searchRegexpBackward(doc, regexp, start) {
                regexp = ensureFlags(regexp, "g")
                for (var line = start.line, ch = start.ch, first = doc.firstLine(); line >= first; line--, ch = -1) {
                  var string = doc.getLine(line)
                  if (ch > -1) string = string.slice(0, ch)
                  var match = lastMatchIn(string, regexp)
                  if (match)
                    return {from: Pos(line, match.index),
                            to: Pos(line, match.index + match[0].length),
                            match: match}
                }
              }

              function searchRegexpBackwardMultiline(doc, regexp, start) {
                regexp = ensureFlags(regexp, "gm")
                var string, chunk = 1
                for (var line = start.line, first = doc.firstLine(); line >= first;) {
                  for (var i = 0; i < chunk; i++) {
                    var curLine = doc.getLine(line--)
                    string = string == null ? curLine.slice(0, start.ch) : curLine + "\n" + string
                  }
                  chunk *= 2

                  var match = lastMatchIn(string, regexp)
                  if (match) {
                    var before = string.slice(0, match.index).split("\n"), inside = match[0].split("\n")
                    var startLine = line + before.length, startCh = before[before.length - 1].length
                    return {from: Pos(startLine, startCh),
                            to: Pos(startLine + inside.length - 1,
                                    inside.length == 1 ? startCh + inside[0].length : inside[inside.length - 1].length),
                            match: match}
                  }
                }
              }

              var doFold, noFold
              if (String.prototype.normalize) {
                doFold = function(str) { return str.normalize("NFD").toLowerCase() }
                noFold = function(str) { return str.normalize("NFD") }
              } else {
                doFold = function(str) { return str.toLowerCase() }
                noFold = function(str) { return str }
              }

              // Maps a position in a case-folded line back to a position in the original line
              // (compensating for codepoints increasing in number during folding)
              function adjustPos(orig, folded, pos, foldFunc) {
                if (orig.length == folded.length) return pos
                for (var min = 0, max = pos + Math.max(0, orig.length - folded.length);;) {
                  if (min == max) return min
                  var mid = (min + max) >> 1
                  var len = foldFunc(orig.slice(0, mid)).length
                  if (len == pos) return mid
                  else if (len > pos) max = mid
                  else min = mid + 1
                }
              }

              function searchStringForward(doc, query, start, caseFold) {
                // Empty string would match anything and never progress, so we
                // define it to match nothing instead.
                if (!query.length) return null
                var fold = caseFold ? doFold : noFold
                var lines = fold(query).split(/\r|\n\r?/)

                search: for (var line = start.line, ch = start.ch, last = doc.lastLine() + 1 - lines.length; line <= last; line++, ch = 0) {
                  var orig = doc.getLine(line).slice(ch), string = fold(orig)
                  if (lines.length == 1) {
                    var found = string.indexOf(lines[0])
                    if (found == -1) continue search
                    var start = adjustPos(orig, string, found, fold) + ch
                    return {from: Pos(line, adjustPos(orig, string, found, fold) + ch),
                            to: Pos(line, adjustPos(orig, string, found + lines[0].length, fold) + ch)}
                  } else {
                    var cutFrom = string.length - lines[0].length
                    if (string.slice(cutFrom) != lines[0]) continue search
                    for (var i = 1; i < lines.length - 1; i++)
                      if (fold(doc.getLine(line + i)) != lines[i]) continue search
                    var end = doc.getLine(line + lines.length - 1), endString = fold(end), lastLine = lines[lines.length - 1]
                    if (endString.slice(0, lastLine.length) != lastLine) continue search
                    return {from: Pos(line, adjustPos(orig, string, cutFrom, fold) + ch),
                            to: Pos(line + lines.length - 1, adjustPos(end, endString, lastLine.length, fold))}
                  }
                }
              }

              function searchStringBackward(doc, query, start, caseFold) {
                if (!query.length) return null
                var fold = caseFold ? doFold : noFold
                var lines = fold(query).split(/\r|\n\r?/)

                search: for (var line = start.line, ch = start.ch, first = doc.firstLine() - 1 + lines.length; line >= first; line--, ch = -1) {
                  var orig = doc.getLine(line)
                  if (ch > -1) orig = orig.slice(0, ch)
                  var string = fold(orig)
                  if (lines.length == 1) {
                    var found = string.lastIndexOf(lines[0])
                    if (found == -1) continue search
                    return {from: Pos(line, adjustPos(orig, string, found, fold)),
                            to: Pos(line, adjustPos(orig, string, found + lines[0].length, fold))}
                  } else {
                    var lastLine = lines[lines.length - 1]
                    if (string.slice(0, lastLine.length) != lastLine) continue search
                    for (var i = 1, start = line - lines.length + 1; i < lines.length - 1; i++)
                      if (fold(doc.getLine(start + i)) != lines[i]) continue search
                    var top = doc.getLine(line + 1 - lines.length), topString = fold(top)
                    if (topString.slice(topString.length - lines[0].length) != lines[0]) continue search
                    return {from: Pos(line + 1 - lines.length, adjustPos(top, topString, top.length - lines[0].length, fold)),
                            to: Pos(line, adjustPos(orig, string, lastLine.length, fold))}
                  }
                }
              }

              function SearchCursor(doc, query, pos, options) {
                this.atOccurrence = false
                this.doc = doc
                pos = pos ? doc.clipPos(pos) : Pos(0, 0)
                this.pos = {from: pos, to: pos}

                var caseFold
                if (typeof options == "object") {
                  caseFold = options.caseFold
                } else { // Backwards compat for when caseFold was the 4th argument
                  caseFold = options
                  options = null
                }

                if (typeof query == "string") {
                  if (caseFold == null) caseFold = false
                  this.matches = function(reverse, pos) {
                    return (reverse ? searchStringBackward : searchStringForward)(doc, query, pos, caseFold)
                  }
                } else {
                  query = ensureFlags(query, "gm")
                  if (!options || options.multiline !== false)
                    this.matches = function(reverse, pos) {
                      return (reverse ? searchRegexpBackwardMultiline : searchRegexpForwardMultiline)(doc, query, pos)
                    }
                  else
                    this.matches = function(reverse, pos) {
                      return (reverse ? searchRegexpBackward : searchRegexpForward)(doc, query, pos)
                    }
                }
              }

              SearchCursor.prototype = {
                findNext: function() {return this.find(false)},
                findPrevious: function() {return this.find(true)},

                find: function(reverse) {
                  var result = this.matches(reverse, this.doc.clipPos(reverse ? this.pos.from : this.pos.to))

                  // Implements weird auto-growing behavior on null-matches for
                  // backwards-compatiblity with the vim code (unfortunately)
                  while (result && CodeMirror.cmpPos(result.from, result.to) == 0) {
                    if (reverse) {
                      if (result.from.ch) result.from = Pos(result.from.line, result.from.ch - 1)
                      else if (result.from.line == this.doc.firstLine()) result = null
                      else result = this.matches(reverse, this.doc.clipPos(Pos(result.from.line - 1)))
                    } else {
                      if (result.to.ch < this.doc.getLine(result.to.line).length) result.to = Pos(result.to.line, result.to.ch + 1)
                      else if (result.to.line == this.doc.lastLine()) result = null
                      else result = this.matches(reverse, Pos(result.to.line + 1, 0))
                    }
                  }

                  if (result) {
                    this.pos = result
                    this.atOccurrence = true
                    return this.pos.match || true
                  } else {
                    var end = Pos(reverse ? this.doc.firstLine() : this.doc.lastLine() + 1, 0)
                    this.pos = {from: end, to: end}
                    return this.atOccurrence = false
                  }
                },

                from: function() {if (this.atOccurrence) return this.pos.from},
                to: function() {if (this.atOccurrence) return this.pos.to},

                replace: function(newText, origin) {
                  if (!this.atOccurrence) return
                  var lines = CodeMirror.splitLines(newText)
                  this.doc.replaceRange(lines, this.pos.from, this.pos.to, origin)
                  this.pos.to = Pos(this.pos.from.line + lines.length - 1,
                                    lines[lines.length - 1].length + (lines.length == 1 ? this.pos.from.ch : 0))
                }
              }

              CodeMirror.defineExtension("getSearchCursor", function(query, pos, caseFold) {
                return new SearchCursor(this.doc, query, pos, caseFold)
              })
              CodeMirror.defineDocExtension("getSearchCursor", function(query, pos, caseFold) {
                return new SearchCursor(this, query, pos, caseFold)
              })

              CodeMirror.defineExtension("selectMatches", function(query, caseFold) {
                var ranges = []
                var cur = this.getSearchCursor(query, this.getCursor("from"), caseFold)
                while (cur.findNext()) {
                  if (CodeMirror.cmpPos(cur.to(), this.getCursor("to")) > 0) break
                  ranges.push({anchor: cur.from(), head: cur.to()})
                }
                if (ranges.length)
                  this.setSelections(ranges, 0)
              })        
        
        })(this.oSimpleMDE.CodeMirror);
        
        var sSelectedTags = localStorage.getItem(this.oRepository.sName+'_aSelectedTags');
        
        oThis.fnSelectTag(localStorage.getItem(this.oRepository.sName+'_sActiveTag'));
        
        console.log('oThis.fnSelectTag', this.oRepository.sName+'_iActiveArticle', localStorage.getItem(this.oRepository.sName+'_iActiveArticle'));
        
        if (sSelectedTags !== null) {
            this.aSelectedTags = JSON.parse(sSelectedTags);
        }

        oThis.fnSelectArticleWithName(localStorage.getItem(this.oRepository.sName+'_iActiveArticle'));
        
        var sTranslationProvider = localStorage.getItem(this.oRepository.sName+'_sTranslationProvider');
        if (sTranslationProvider !== null) 
            this.sTranslationProvider = sTranslationProvider;
        var sTranslationFromLanguage = localStorage.getItem(this.oRepository.sName+'_sTranslationFromLanguage');
        if (sTranslationFromLanguage !== null) 
            this.sTranslationFromLanguage = sTranslationFromLanguage;
        var sTranslationToLanguage = localStorage.getItem(this.oRepository.sName+'_sTranslationToLanguage');
        if (sTranslationToLanguage !== null) 
            this.sTranslationToLanguage = sTranslationToLanguage;
        
        var bShowEditor = localStorage.getItem(this.oRepository.sName+'_bShowEditor');
        if (bShowEditor !== null) {
            this.bShowEditor = bShowEditor;
        }
    },
    
    created: function()
    {
        console.log('repositories tab created');
    }
};

</script>
