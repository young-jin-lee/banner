'use strict';

$(function () { 
    // 인스턴스 생성 
    var rolling1 = new RollingBanner("#banner1", 3000, 1000); // 롤링 배너 인터벌 3초 지정, 롤링 애니메이션효과 1초 
    var rolling2 = new RollingBanner("#banner2", 1000, 500); // 롤링 배너 인터벌 1초 지정, 롤링 애니메이션효과 0.5초 
}); 

// 메서드와 프로퍼티를 담을 생성자(클래스)를 생성 
function RollingBanner(selector, speed, animateSpeed) { 
    // 프로퍼티 생성 및 초기화 
    // 배너 목록을 담을 프로퍼티 생성 
    // (객체 내부에서만 사용할 프로퍼티이기 때문에 private이라는 의미로 언더바(_)를 사용) 
    this._$banners = null; 
    // 초기 활성화된 인덱스 정보를 담을 프로퍼티 생성 
    this._currentIndex = 0; 
    
    this._timerID = -1; 
    this._bannerHeight = 0; 
    this._speed = speed; 
    this._aniSpeed = animateSpeed; 
    
    this._init(selector);
    this._initEvent();
}

RollingBanner.prototype = { 
    // 요소 초기화 
    '_init' : function (selector) { 
        //this._$banners = $(selector).children(".container"); 
        this._$banners = $(selector).children("img"); 
        console.log("AA", this._$banners);
        this._bannerHeight = this._$banners.eq(0).height(); 
    }, 
        
    // 이벤트 처리 
    '_initEvent' : function () { 
        var _self = this; 
        // 롤링 배너 위치값 자동 설정하기 위해 높이 값 구하기 
        // 이미지와 같은 리소스까지 모두 읽어들여야 높이값을 구할 수 있기 때문에 onload 이벤트를 이용 
        //console.log("VVV",this._$banners.eq(0));
        console.log("INITIALIZED");
        this._$banners.on('load', function () { 
            console.log("LOADED");
            _self._bannerHeight = $(this).height();
            console.log("HELLO", _self._bannerHeight); 
            _self._start(); 
        }) 
    }, 
    
    '_start' : function () { 
        this._initBannerPos(); 
        this.startAutoPlay();            
    }, 
                
    '_initBannerPos' : function () {         
        // 배너 위치 화면에서 모두 숨기기(top을 이용해 아래로 밀어낸 것)
        this._$banners.css({ 
            top : this._bannerHeight
        });

        // 0번째 배너 활성화 
        this._$banners.eq(this._currentIndex).css({ 
            top : 0 
        });  
    }, 
                
    'startAutoPlay' : function () { 
        var _self = this; 
        // 타이머가 두 번이상 실행되지 않도록 조건 처리 
        if(this._timerID == -1) { 
            this._timerID = setInterval(function () { 
                _self.nextBanner(); 
            }, 
            this._speed); // 인터벌 지정     
        }     
        
    }, 

    'nextBanner' : function () { 
        // 현재 인덱스값 구하기 
        var outIndex = this._currentIndex;     
        // 다음 배너 인덱스값 구하기 
        this._currentIndex++;
        // 마지막 배너까지 롤링되면 다시 0번째부터 롤링되도록 인덱스값 설정하기 
        if (this._currentIndex >= this._$banners.length) { this._currentIndex = 0; } 
        // 현재 배너 구하기 
        var $outBanner = this._$banners.eq(outIndex); 
        // 다음 배너 구하기 
        var $inBanner = this._$banners.eq(this._currentIndex); 
        // 롤링 준비 - 나타날 다음 배너 위치 초기화 
        $inBanner.css({ top: this._bannerHeight, opacity : 0.5 }); 
        // 현재 배너 사라지게 하기 
        $outBanner.stop().animate({ top: -this._bannerHeight, opacity : 0.5 }, this._aniSpeed); 
        // 애니메이션 스피드 지정 
        // 다음 배너 나타나게 하기 
        $inBanner.stop().animate({ top : 0, opacity : 1 }, this._aniSpeed); // 애니메이션 스피드 지정               
    }        
}

