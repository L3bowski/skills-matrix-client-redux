(function (ajax, paginatedListUtils) {

    var viewName = 'skillsList';
    var skillslistReduxId = 'skills-list';
    var skillslistHtmlId = 'skills-list-wrapper';

    function skillsFetcher(state) {
        return ajax.get('/api/skill', {
            keywords: state.keywords,
            page: state.page + state.pageOffset,
            pageSize: state.pageSize
        }, paginatedListUtils.getDefaultResults());
    }

    var viewReducer = paginatedListUtils.getReducer(skillslistReduxId);

    var viewRenderer = paginatedListUtils.getRenderer(skillslistHtmlId, '<i>No skills found</i>',
    function (skill) {
        return '<li class="list-group-item"><a class="reset" href="/skills/details?id=' +
        skill.Id + '">' + skill.Name + '</a></li>';
    });

    var actionBinders = function(store) {
        var htmlNodes = paginatedListUtils.getHtmlNodes(skillslistHtmlId);
        var actionDispatchers = paginatedListUtils.getActionDispatchers(
            store,
            skillslistReduxId,
            skillsFetcher,
            viewName
        );
        paginatedListUtils.bindDefaultEventHandlers(htmlNodes, actionDispatchers);
    };

    
    var viewLoader = function(pageData, store) {            
        store.dispatch({
            type: 'paginatedListInitialize',
            listId: skillslistReduxId,
            config: {
                hasSearcher: true,
                hasPagination: true
            }
        });

        return skillsFetcher(store.getState()[viewName])
        .then(function(results) {
            store.dispatch({
                type: 'paginatedListResults',
                listId: skillslistReduxId,
                results
            });
        });
    };
    
    window.Views = window.Views || [];
    window.Views.push({
        name: viewName,
        htmlNodeId: 'skills-list-section',
        reducer: viewReducer,
        renderer: viewRenderer,
        actionBinders,
        loader: viewLoader
    });

})(window.Ajax, window.PaginatedListUtils);
    