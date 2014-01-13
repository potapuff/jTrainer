var introduction = function () {
    this.preDispatch = function () {
    }
    
    this.postDispatch = function () {
    }

    this.mustache = function () {
        return {LANGS:    new LangList().setLangs(I18N.getLangNames())
                                        .setPattern('<option value="%lang%" %current%>%name%</option>')
                                        .render()
                }
    }
}