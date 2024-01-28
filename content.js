const ext = {
    state: 0,
    minShowTime: 1000,
    minWaitTime: 800,
    buttonContainer: undefined
};

window.onload = () => {

    const container = document.createElement('div');
    container.className = "format-button-container color-bg-subtle";

    const button = document.createElement('button');
    button.innerText = 'Only show review comments';
    button.className = 'btn-primary btn';
    button.onclick = () => {
        container.style.display = 'none';
        ext.state = 0;
        format();
    };

    container.appendChild(button);
    ext.buttonContainer = container;

    document.addEventListener('mousedown', () => appendButton(1500));
    appendButton();
}

const appendButton = (timeout = 0) => {
    setTimeout(() => {
        const descriptionBlock = document.querySelector('.TimelineItem.js-command-palette-pull-body');
        if ( descriptionBlock ) descriptionBlock.append(ext.buttonContainer);
    }, timeout);
}

const format = () => {
    switch(ext.state){
        case 0:
            modal(true);
            break;
        case 1:
            expandHiddenComments();
            break;
        case 2:
            filterReviewComments();
            break;
        case 3:
            modal(false);
            break;      
    }
}

const modal = ( show ) =>{
    show ? showModal() : hideModal(); 
}

const showModal = () => {
    const modal = document.createElement('div');
    modal.id = 'loading-modal';
    modal.innerHTML = `
        <image width="200" height="200" src="https://stylishthemes.github.io/GitHub-Dark/images/octocat-spinner-smil.min.svg"/>
        <h1>Formatting Github Pull Request</h1>
        <p>one moment please...</p>
    `;
    document.body.appendChild( modal );
    ext.modal = modal;
    ext.showTime = new Date().getTime();
    setTimeout(()=>{
        ext.state++;
        format();
    }, 50)
}

const hideModal = () => {
    const timeShown = new Date().getTime() - ext.showTime;
    if (timeShown < ext.minShowTime){
        setTimeout(hideModal, ext.minShowTime - timeShown);
    } else {
        document.body.removeChild( ext.modal );
        delete ext.modal;
    }
}

const expandHiddenComments = () => {
    const expandButton = document.querySelector('.ajax-pagination-btn.no-underline.pb-1.pt-0.px-4.mt-0.mb-1.color-bg-default.border-0');
    if ( expandButton ){
        expandButton.click();
        setTimeout( expandHiddenComments, ext.minWaitTime);
    } else {
        ext.state++;
        format();
    }
}

const filterReviewComments = () => {
    const commits = document.querySelectorAll('.js-timeline-item');
    for(let i = 0; i < commits.length; i++){
        const commit = commits[i];
        if ( !commit.children[0]?.children[0]?.classList.contains('js-comment') ){
            commit.parentElement.removeChild(commit);
        }
    }
    ext.state++;
    format();
}