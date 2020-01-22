

const header = document.querySelector('#header');
const sidebox = document.querySelector('.side_box');
const variableWidth = document.querySelectorAll('.contents_box .contents');
const deligation = document.querySelector('.contents_box');


function deligationFunc(e){
    
    let element = e.target;
    
    console.log(element);
    
    while(!element.getAttribute('data-name')){
        element = element.parentNode;
        
        if(element.nodeName === 'BODY'){
            element = null;
            return;
        }
    }
    
    if(element.matches('[data-name="heartbeat"]')){
        
        console.log('heart');
         let pk = element.getAttribute('name');
        
        $.ajax({
            type:'GET',
            url:'data/like.json',
            data:{pk},
            dataType:'json',
            success: function(response){
                let likeCount = document.querySelector('#like-count-37');
                likeCount.innerHTML = '좋아요 ' + response.like_count + '개';
            },
            error: function(request,status,error){
                alert('로그인이 필요합니다.');
                window.location.replace('https://www.naver.com');
            }
        })
        
    }else if(element.matches('[data-name="bookmark"]')){
        
        console.log('bookmark');
        
        let pk = element.getAttribute('name');
        
        $.ajax({
            
            type:'GET',
            url:'data/bookmark.json',
            data:{pk},
            dataType:'json',
            success:function(response){
                let bookmarkCount = document.querySelector('#bookmark-count-' + pk);
                bookmarkCount.innerHTML = '북마크 ' + response.bookmark_count + '개';
            }
        })
        
    }else if(element.matches('[data-name="comment"]')){
        
        let content = document.querySelector('#add-comment-post-37>input[type=text]').value;
        
        console.log(content);
        
        if(content.length > 140){
            alert('댓글은 최대 140글자 입력 가능합니다, 현재 글자수: ' + content.length);
            return 
        }
        
        $.ajax({
            
            type:'GET',
            url:'./comment.html',
            data:{
                'pk':37,
                'content':content,
            },
            dataType:'html',
            success:function(data,){
                document.querySelector('#comment-list-ajax-post37').insertAdjacentHTML('afterbegin',data);
            },
            error: function(request,status,error){
                alert('문제가 발생했습니다.');
            }
        })
        
        document.querySelector('#add-comment-post-37>input[type=text]').value = '';
        
    }else if(element.matches('[data-name="comment_delete"]')){
        
        $.ajax({
            
            type:'GET',
            url:'data/delete.json',
            data:{
                'pk':37,   
            },
            dataType:'json',
            success:function(response){
                if(response.status){
                    comment.remove();
                }else{
                    let comment = document.querySelector('.comment-detail');
                    console.log('삭제가 왜 안돼ㅜㅜ');
                }
            },
            error: function(request,status,error){
                alert('문제가 발생했습니다.');
            } 
        })
        
    }else if(element.matches('[data-name="follow"]')){
        
        $.ajax({
            
            type:'GET',
            url:'data/follow.json',
            data:{
                'pk':37,
            },
            dataType:'json',
            success: function(response){
                if(response.status){
                    document.querySelector('input.follow').value = '팔로잉';
                }else{
                    document.querySelector('input.follow').value = '팔로워';
                }
            },
            error: function(request,status,error){
                alert('문제가 발생했습니다.');
            }
        })
        
    }
    
    element.classList.toggle('on');
    
}

function resizeFunc(){
    
    console.log('resizing!!')
    if(pageYOffset >= 10){
        
        let calcWidth = (window.innerWidth*0.5) + 170;
        
        console.log(window.innerWidth*0.5);
        
        sidebox.style.left = calcWidth + 'px';
    }   
    
    if(matchMedia('screen and (max-width : 800px)').matches){
        
        for(let i=0; i< variableWidth.length; i++){
        
            variableWidth[i].style.width = window.innerWidth - 20 + 'px';
            
        }
        
    }else{
        
        for(let i=0; i< variableWidth.length; i++){
            
            if(window.innerWidth > 600)
            variableWidth[i].removeAttribute('style');
            
        }
    }
    
}

function scrollFunc(){
    
    let scrollHeight = pageYOffset + window.innerHeight ;
    let documentHeight = document.body.scrollHeight;
    
    console.log('scrollHeight: ' + scrollHeight);
    console.log('documentHeight: ' + documentHeight);
    
    if(pageYOffset >= 10){
        header.classList.add('on');
        if(sidebox){
            sidebox.classList.add('on');
        }
        resizeFunc();
        
    }else{
        header.classList.remove('on');
        if(sidebox){
            sidebox.classList.remove('on');
            sidebox.removeAttribute('style');
        }
    }
    
    if(scrollHeight >= documentHeight){
        let page = document.querySelector('#page').value;
        document.querySelector('#page').value = parseInt(page) + 1;
        
        callMorePostAjax(page);
        
        if(page >= 5){
            return;
        }
    }
}

function callMorePostAjax(page){
    
    if(page >= 5){
            return;
    }
    
    $.ajax({
        type:'GET',
        url:'./post.html',
        data:{
            'post':page,
        },
        dataType:'html',
        success: addMorePostAjax,
        error: function(request,status,error){
                alert('문제가 발생했습니다.');
        }
    })
}

function addMorePostAjax(data){
    
    deligation.insertAdjacentHTML('beforeend',data);
    
}

setTimeout(function(){
    
    scrollTo(0,0);
    
},100)

if(deligation){
    deligation.addEventListener('click', deligationFunc);
}

window.addEventListener('resize',resizeFunc);
window.addEventListener('scroll',scrollFunc);


















