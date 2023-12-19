function getCurrentTheme()
{
    return localStorage.theme || 'light';
}

function setTheme(theme)
{
    document.documentElement.setAttribute('data-theme', theme);

    let metaElem = document.querySelector('meta[name="color-scheme"]');
    if (!metaElem)
    {
        let elem = document.createElement('meta');
            elem.name = 'color-scheme',
        
        document.head.append(elem);
        metaElem = elem;
    }

    metaElem.setAttribute('content', theme);
    localStorage.setItem('theme', theme);
}

function switchTheme()
{
    let newTheme = getCurrentTheme() === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
}

setTheme(getCurrentTheme());