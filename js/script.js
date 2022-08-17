/*
laziload
*/
(function () {
  var canUseWebP = function () {
    var elem = document.createElement("canvas");

    if (!!(elem.getContext && elem.getContext("2d"))) {
      // was able or not to get WebP representation
      return elem.toDataURL("image/webp").indexOf("data:image/webp") == 0;
    }

    // very old browser like IE 8, canvas not supported
    return false;
  };

  var isWebpSupported = canUseWebP();

  if (isWebpSupported === false) {
    var lazyItems = document.querySelectorAll("[data-src-replace-webp]");

    for (var i = 0; i < lazyItems.length; i += 1) {
      var item = lazyItems[i];

      var dataSrcReplaceWebp = item.getAttribute("data-src-replace-webp");
      if (dataSrcReplaceWebp !== null) {
        item.setAttribute("data-src", dataSrcReplaceWebp);
      }
    }
  }
  var lazyLoadInstance = new LazyLoad({
    elements_selector: ".lazy",
  });
})();
(function () {
  window.myLib = {};
  window.myLib.body = document.querySelector("body");
  window.myLib.closesAttr = function (item, attr) {
    var node = item;
    while (node) {
      var atrrValue = node.getAttribute(attr);
      if (atrrValue) {
        return atrrValue;
      }
      node = node.parentElement;
    }
    return null;
  };
  window.myLib.closesItemByClass = function (item, className) {
    var node = item;
    while (node) {
      if (node.classList.contains(className)) {
        return node;
      }
      node = node.parentElement;
    }
    return null;
  };
  window.myLib.toggleScroll = function () {
    myLib.body.classList.toggle("no-scroll");
  };
})();
;
;(function () {
 
    var showPopup = function(target){
      target.classList.add('is--active');
    };
    var closePopup = function(target){
      target.classList.remove('is--active');
    };
    
    myLib.body.addEventListener('click',function (e) {
      var target = e.target;
      var popupClass = myLib.closesAttr(target,'data-popup');
      if (popupClass == null) {
        return;
      }
      e.preventDefault();
      var popup = document.querySelector('.'+ popupClass);
      if (popup) {
        showPopup(popup);
        myLib.toggleScroll();
      }
    });
    myLib.body.addEventListener('click',function (e) {
     var target = e.target;
     if (target.classList.contains('popup__close') ||
     target.classList.contains('popup__inner') ) {
      var popup = myLib.closesItemByClass(target,'popup');
       closePopup(popup);
       myLib.toggleScroll();
     }
    });
    myLib.body.addEventListener('keydown',function (e) {
    if (e.keyCode !== 27) {
      return;
    }
    var popup = document.querySelector('.popup.is--active');
    if (popup) {
      closePopup(popup);
      myLib.toggleScroll();
    }
    });
  })();
  ;

(function ($) {
  $(".open-menu").on("click", function () {
    $(this).toggleClass('active');
    $(".mobile-menu").slideToggle('300');
    $(".mobile-menu a").on("click", function () {
      $(".mobile-menu").removeClass("active");
    });
  });
  // var scrolled;
  // window.onscroll = function () {
  //   scrolled = window.pageYOffset || document.documentElement.scrollTop;
  //   if (scrolled < 100) {
  //     $(".btn-scroll").removeClass("active");
  //   }
  //   if (scrolled > 100) {
  //     $(".btn-scroll").addClass("active");
  //   }
  // };
})(jQuery);
(function () {
  function DynamicAdapt(type) {
    this.type = type;
  }
  DynamicAdapt.prototype.init = function () {
    const _this = this;
    // массив объектов
    this.оbjects = [];
    this.daClassname = "_dynamic_adapt_";
    // массив DOM-элементов
    this.nodes = document.querySelectorAll("[data-da]");

    // наполнение оbjects объктами
    for (let i = 0; i < this.nodes.length; i++) {
      const node = this.nodes[i];
      const data = node.dataset.da.trim();
      const dataArray = data.split(",");
      const оbject = {};
      оbject.element = node;
      оbject.parent = node.parentNode;
      оbject.destination = document.querySelector(dataArray[0].trim());
      оbject.breakpoint = dataArray[1] ? dataArray[1].trim() : "767";
      оbject.place = dataArray[2] ? dataArray[2].trim() : "last";
      оbject.index = this.indexInParent(оbject.parent, оbject.element);
      this.оbjects.push(оbject);
    }

    this.arraySort(this.оbjects);

    // массив уникальных медиа-запросов
    this.mediaQueries = Array.prototype.map.call(
      this.оbjects,
      function (item) {
        return (
          "(" +
          this.type +
          "-width: " +
          item.breakpoint +
          "px)," +
          item.breakpoint
        );
      },
      this
    );
    this.mediaQueries = Array.prototype.filter.call(
      this.mediaQueries,
      function (item, index, self) {
        return Array.prototype.indexOf.call(self, item) === index;
      }
    );

    // навешивание слушателя на медиа-запрос
    // и вызов обработчика при первом запуске
    for (let i = 0; i < this.mediaQueries.length; i++) {
      const media = this.mediaQueries[i];
      const mediaSplit = String.prototype.split.call(media, ",");
      const matchMedia = window.matchMedia(mediaSplit[0]);
      const mediaBreakpoint = mediaSplit[1];

      // массив объектов с подходящим брейкпоинтом
      const оbjectsFilter = Array.prototype.filter.call(
        this.оbjects,
        function (item) {
          return item.breakpoint === mediaBreakpoint;
        }
      );
      matchMedia.addListener(function () {
        _this.mediaHandler(matchMedia, оbjectsFilter);
      });
      this.mediaHandler(matchMedia, оbjectsFilter);
    }
  };

  DynamicAdapt.prototype.mediaHandler = function (matchMedia, оbjects) {
    if (matchMedia.matches) {
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        оbject.index = this.indexInParent(оbject.parent, оbject.element);
        this.moveTo(оbject.place, оbject.element, оbject.destination);
      }
    } else {
      for (let i = 0; i < оbjects.length; i++) {
        const оbject = оbjects[i];
        if (оbject.element.classList.contains(this.daClassname)) {
          this.moveBack(оbject.parent, оbject.element, оbject.index);
        }
      }
    }
  };

  // Функция перемещения
  DynamicAdapt.prototype.moveTo = function (place, element, destination) {
    element.classList.add(this.daClassname);
    if (place === "last" || place >= destination.children.length) {
      destination.insertAdjacentElement("beforeend", element);
      return;
    }
    if (place === "first") {
      destination.insertAdjacentElement("afterbegin", element);
      return;
    }
    destination.children[place].insertAdjacentElement("beforebegin", element);
  };

  // Функция возврата
  DynamicAdapt.prototype.moveBack = function (parent, element, index) {
    element.classList.remove(this.daClassname);
    if (parent.children[index] !== undefined) {
      parent.children[index].insertAdjacentElement("beforebegin", element);
    } else {
      parent.insertAdjacentElement("beforeend", element);
    }
  };

  // Функция получения индекса внутри родителя
  DynamicAdapt.prototype.indexInParent = function (parent, element) {
    const array = Array.prototype.slice.call(parent.children);
    return Array.prototype.indexOf.call(array, element);
  };

  // Функция сортировки массива по breakpoint и place
  // по возрастанию для this.type = min
  // по убыванию для this.type = max
  DynamicAdapt.prototype.arraySort = function (arr) {
    if (this.type === "min") {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return -1;
          }

          if (a.place === "last" || b.place === "first") {
            return 1;
          }

          return a.place - b.place;
        }

        return a.breakpoint - b.breakpoint;
      });
    } else {
      Array.prototype.sort.call(arr, function (a, b) {
        if (a.breakpoint === b.breakpoint) {
          if (a.place === b.place) {
            return 0;
          }

          if (a.place === "first" || b.place === "last") {
            return 1;
          }

          if (a.place === "last" || b.place === "first") {
            return -1;
          }

          return b.place - a.place;
        }

        return b.breakpoint - a.breakpoint;
      });
      return;
    }
  };
  const da = new DynamicAdapt("max");
  da.init();
})();
;
const swiper = new Swiper(".swiper-container", {
  centeredSlides: true,
  speed: 2000,
  loop: true,
  pagination: {
    el: ".swiper-pagination",
    clickable: true,
  },
  navigation: {
    nextEl: ".swiper-button-next",
    prevEl: ".swiper-button-prev",
  },
  breakpoints: {
    // when window width is >= 320px
    320: {
      slidesPerView: 1,
      slidesPerGroup: 1,
      spaceBetween: 10,
    },
    // when window width is >= 480px
    580: {
      slidesPerView: 2,
      slidesPerGroup: 1,
      spaceBetween: 10,
    },
    1200: {
      slidesPerView: 4,
      slidesPerGroup: 1,
      spaceBetween: 20,
    },
  },
});
;
