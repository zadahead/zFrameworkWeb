

var routing = {
    init: () => {
        window.addEventListener('popstate', routing.pop);
    },

    pop: (e) => {
        var state = e.state;

        if (state) {
            if (state.startsWith('/home/')) {
                home.show.sec();
            }
        }
        
        
    },

    send: (wrap, sec) => {
        var page = null;

        switch (wrap) {
            case 'inventory/list':
                switch (sec) {
                    case 'inventory/list/inventory':
                        page = '/home/inventory';
                        break;
                    case 'inventory/list/templates':
                        page = '/home/templates';
                        break;
                    case 'inventory/list/lookups':
                        page = '/home/lookups';
                        break;
                    case 'inventory/list/headers':
                        page = '/home/headers';
                        break;
                    case 'inventory/list/cross':
                        page = '/home/cross';
                        break;
                    case 'inventory/list/labels':
                        page = '/home/labels';
                        break;
                    case 'inventory/list/ftp':
                        page = '/home/ftp';
                        break;
                    case 'inventory/list/define':
                        page = '/home/define';
                        break;
                    case 'inventory/list/dashboard':
                        page = '/home/dashboard';
                        break;
                    default:
                        break;
                }
                break;


            case 'mapping/container':
                switch (sec) {
                    case 'mapping/list/cross':
                        page = '/mapping/cross';
                        break;
                    case 'mapping/list/categories':
                        page = '/mapping/categories';
                        break;
                    case 'mapping/list/cmdb_categories':
                        page = '/mapping/cmdb_categories';
                        break;
                    default:
                        break;
                }
                break;

            case 'settings/container':
                switch (sec) {
                    case 'settings/list/clients':
                        page = '/settings/clients';
                        break;
                    default:
                        break;
                }
                break;


            default:
                break;
        }
       

        if (window.location.pathname == page) {
            return;
        }

        if (page) {
            core.reload();
            uikit.evt.state.push(page);
        }
    }
}

core.init.add(routing.init);