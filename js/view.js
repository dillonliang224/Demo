#parse ("$endplayMacros/INIT")

#set( $MOVIDEO_TAGS = {
 "All" : "*",
 "video_news" : "video_news",
 "video_entertainment" : "video_entertainment",
 "video_people" : "video_people",
 "video_fashion" : "video_fashion",
 "video_life" : "video_life",
 "video_eat_travel" : "video_eat&travel",
 "live_event" : "live_event",
 "video_wine" : "video_wine",
 "video_car" : "video_car",
 "video_watch" : "video_watch",
 "video_3c" : "video_3c",
 "video_international" : "video_international",
 "video_pet" : "video_pet",
 "video_fun" : "video_fun",
 "video_relationship" : "video_relationship",
 "video_feature" : "video_feature",
 "video_politics" : "video_politics",
 "video_election" : "video_election",
 "video_business" : "video_business"
} )

#macro( renderMovideoMoreVideos ) 
 #set($containerID = 'movideoNMTMoreVideosContainer' + $reserved-article-id.data)
  #set ($layoutPlid = $request.get("attributes").get("layoutPlid"))
 #set ($friendlyURL = $request.get("attributes").get("friendlyURL"))
 #set ($pathFriendlyURL = $request.get("attributes").get("pathFriendlyURL"))
 
 #set($resultPerPage = 12)
 #if($validator.isNotNull($max-results-per-page))
  #set($resultPerPage = $getterUtil.getInteger($max-results-per-page.data))
 #end
 <!-- begin: MORE VIDEOS -->
 <section class="mod-wrapper mod-grid mod-media-grid" id="${containerID}">
  <header class="mod-header">
   <h3>${module_title.data}</h3>
   <div class="sort-filter row mini-grid">
    <div class="filter col-6 custom-select">
     <select class="col-12" data-bind="value: sort, enable: ready" disabled>
      <option value="creationdate" selected>${sort.create-date.data}</option>
      <option value="playstotal">${sort.views.data}</option>
     </select>
    </div>
    <div class="sort col-6 custom-select">
     <select class="col-12 categories" data-bind="value: category, enable: ready" disabled>
      #foreach($tag in $category.tag.getSiblings())
       #set($categoryTag = $MOVIDEO_TAGS[$tag.tag-category.data])
       #if($velocityCount==0)
        #set($sel = " selected")
       #else
        #set($sel = "")
       #end
       <option value="${htmlUtil.escapeAttribute($categoryTag)}"${sel}>${tag.data}</option>
      #end
     </select>
    </div>
   </div>
  </header>
  <div class="mod-body">
   <div class="loading-animation" data-bind="visible: showing"></div>
   <!--<div class="loading-animation" data-bind="visible: loading"></div>-->
   <ul class="list columns three" data-bind="foreach: { data: mediaList, as: 'video' }, visible: showing()==false && mediaList().length>0" style="display:none">
   <!--<ul class="list columns three" data-bind="foreach: { data: mediaList, as: 'video' }, visible: loading()==false && mediaList().length>0" style="display:none">-->
    ###No Velocity Parse START
    #[[
    <li data-bind="css: $root.getCategoryClass(video)">
     <a class="content-link" href="#" data-bind="click: $root.loadVideoPlaylist, attr: { href: $root.getVideoUrl(video), title: video.title }">
      <span class="thumb">
    ]]# ###No Velocity Parse END
       #[[<div class="crop-photo" data-bind="attr: {style : $root.getBgStyle(video.imagePath)}">]]#
        <img data-bind="attr: { alt: video.title }" src="$themeImagePath/placeholder/placeholder-16x9.jpg" alt="">
    ###No Velocity Parse START
    #[[
        <!-- ko if: $root.isPlaying(video) -->
    ]]# ###No Velocity Parse END
        <span class="current txt-white">${labels.playing.data}</span>
        <!-- /ko -->
       </div>
      </span>
      <h4 data-bind="NXMMovideoPlaylistVideoTitle: video.title"></h4>
      <span class="info">
       #[[<time data-bind="text: $root.getMediaDateDashed(video), attr: { datetime: $root.getMediaDateDashed(video) }"></time>]]# 
       #if( $show-views.data==true )
          <span><i class="ep-icon-preview"></i>
               <span data-bind="css: $root.getNumclass(video)"></span>
          </span>
       #end
      </span>
     </a>
    </li>
   </ul>
  </div>
  <div class="videoIdString" style="display:none" data-bind="css: $root.getDataFromNGS()"></div>
  <!--<footer class="mod-footer align-center" style="display:none" data-bind="visible: loading()!=true && mediaList().length>0 && hasNextPage()"> -->
  <footer class="mod-footer align-center" style="display:none" data-bind="visible: showing()!=true && mediaList().length>0 && hasNextPage()">
   <div class="loading-animation" data-bind="visible: appendLoading" style="display:none"></div>
   <a href="#" class="more-btn align-center" data-bind="click: appendNextPage, visible: appendLoading()!=true" style="display:none">${labels.more-videos.data} <i class="ep-icon-arrow-down-09"></i></a>
  </footer>
 </section>
 <script>
 (function ($, A) {
  AUI().use('nxm-movideo-playlist-local', 'datatype-date', function () {
   var NXM_MOVIDEO = EP.Clients.NXM.Movideo;
   
   var startDate = new Date();
   /* last 31 days */
   startDate.setDate(startDate.getDate() - 31);
   var last31Creation = A.DataType.Date.format(startDate, {format:'%F'}) + 'T00:00:00';
   
   var config = {
    creationDate: last31Creation,
    creationDateOperator: 'GT',
    itemsPerPage: ${resultPerPage},
                groupId: ${groupId}
      };
   
   var model = new NXM_MOVIDEO.Playlist(config);
   model.getBgStyle = function(imagePath){
    var img = model.getImage(imagePath, ${IMG_SIZE.SML_WIDTH}, ${IMG_SIZE.SML_HEIGHT});
    return "background-image: url('"+img+"');";
   };


   /*Begin: Video view count*/

      model.showing = ko.observable(true);
      model.getDataFromNGS = function(){
           model.showing(true);
           var videoString = model.videoIdListString();
           if(videoString){
               console.log("videoString : "+videoString);
               var movideoViewCountAjaxUrl = "${pathFriendlyURL}${friendlyURL}/refresh-article/${layoutPlid}/${reserved-article-id.data}/NMT_MOVIDEO_VIEW_COUNT?movideoId=" + videoString;
                   $.ajax({
                       url: movideoViewCountAjaxUrl,
                       type: "POST",
                       // async: false,
                       success: function(data) {
                         pushViewCountToVideo(data);
                         viewData = data;
                       }
               });
           } else {
              model.showing(false);
           }

            /*$.each(model.mediaList(), function (idx, vid) {
               console.log("video: " + vid.id);
            });*/
      };

      model.getNumclass = function(video){
         return "number-"+video.id;
      };

    pushViewCountToVideo = function(data){
        // model.showing(false);
        data = data.replace(/\s+/g,"");
        var viewCountArray = new Array();
        viewCountArray = data.split(",");
        for (var i=0;i<viewCountArray.length;i++)
        {
            var viewCountKey = '';
            var viewCountValue = 0;
            var viewCountTemp = '';
            viewCountTemp = viewCountArray[i].split(":");
            viewCountKey = viewCountTemp[0];
            // console.log("viewCountKey: " + viewCountKey);
            viewCountValue = viewCountTemp[1];
            viewCountKey = viewCountKey.replace(/\"/g, "");
            var numClassPath = "#${containerID} .number-" + viewCountKey;
            if (viewCountKey == 0){
                $("#${containerID} .number-").html("<span>0</span>");
            } else {
                $(numClassPath).html("<span>"+ viewCountValue + "</span>");
            }
        }

        /*$.each(model.mediaList(), function (idx, vid) {
               console.log("video: " + vid.id);
               if(!vid.id) {
                 vid.id = 0;
               }
               vid.count = 1;
        });*/
        model.showing(false);
   };
   /*End: Video view count*/

   ###No Velocity Parse START
   #[[
   model.getViews = function(video){
    var byMonth = (model.sort()==='playstotal');
    return (video && video.mediaPlays) ? (byMonth ? video.mediaPlays.month : video.mediaPlays.total) : null;
   };
   
   //Custom Bindings
   ko.bindingHandlers.NXMMovideoPlaylistVideoTitle = {
    init: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext) {
     var value = valueAccessor();
     
     // Next, whether or not the supplied model property is observable, get its current value
     var marker = ko.utils.unwrapObservable(value);
     
     // Now manipulate the DOM element
     var $el = $(element);
     $el.text(value).dotdotdot({
      /* Whether to update the ellipsis: true/'window' */
      watch  : 'window',
      /* Optionally set a max-height, if null, the height will be measured. */
      height  : 40
     });
     
     //handle disposal (if KO removes by the template binding)
     ko.bindingHandlers.NXMMovideoPlaylistVideoTitle.handleDisposal(element, $el, marker);
    },
    update: function(element, valueAccessor, allBindingsAccessor, viewModel, bindingContext, markerSize) {
     var value = valueAccessor();
     /* dotdotdot update */
     var $el = $(element);
     $el.text(value).trigger("update");
     A.later(100, $el, $el.trigger, "update" );
    },
    handleDisposal: function(element, $element, marker, preDisposeCallback) {
     //handle disposal (if KO removes by the template binding)
     var dispose = function() {
      if(preDisposeCallback){
       preDisposeCallback.apply(this, [element, $element, marker]);
      }
      $element.trigger('destroy'); /* dotdotdot destroy */
      $element.unbind();
      A.one(element).destroy(true);
      ko.utils.domNodeDisposal.removeDisposeCallback(element, dispose);
     };
     ko.utils.domNodeDisposal.addDisposeCallback(element, dispose);
    }
   };
   ]]# ###No Velocity Parse END
   var container = document.getElementById('${containerID}');
   var jCon = $(container);
   var categorySelect = jCon.find('select.categories').first();
   var list = jCon.find('.mod-body ul.list').first();
   var ensureMinHeight = function(){
    var lis = list.children('li');
    lis.css('min-height', '');
    var minHeight = parseFloat(lis.first().css('min-height'));
    if(isNaN(minHeight)){
     minHeight = 0 
    }
    var ht = minHeight;
    lis.each(function(idx, el){
     ht = Math.max(ht, $(el).height());
    });
    if(ht>minHeight){
     lis.css('min-height', (ht+'px'));
    }
   };
   var dis = this;
   var delayEnsureMinHeight = function(){
    A.later(200, dis, ensureMinHeight);
   };
   model.mediaList.subscribe(delayEnsureMinHeight);
   $(window).resize(delayEnsureMinHeight);
   $(document).ready(ensureMinHeight);
   
   /*Apply Bindings*/
   ko.applyBindings(model, container);
   model.update();
   
   //override loadVideo function to pass category playlist
   var superLoadVideo = model.loadVideo;
   model.loadVideo = function (videoData, event) {
    if (NXM_MOVIDEO.players.length && NXM_MOVIDEO.categoryPlaylistKO) {
     var categoryId = model.category();
     categoryId = (categoryId!=null) ? $.trim(categoryId) : null;
     if(categoryId!=null && categoryId!='' && categoryId!='*'){
      NXM_MOVIDEO.selectedMedia = videoData;
      //clone
      var clone = new NXM_MOVIDEO.Playlist(A.mix(config, {
       category: categoryId,
       sort: model.sort()
      }, true));
      clone.mediaList( model.mediaList() );
      clone.categoryLabel = categorySelect.children('option:selected').text();
      clone.loading(false);
      //kill old clones
      var prev = NXM_MOVIDEO.categoryPlaylistKO ? NXM_MOVIDEO.categoryPlaylistKO() : null;
      if(prev){
       prev.destroy(); 
      }
      NXM_MOVIDEO.categoryPlaylistKO( clone );
     }
    }
    return superLoadVideo(videoData, event);
   };
  });
 })(jQuery, AUI());
 </script>
 <!-- end: MORE VIDEOS -->
#end

#if($isMOBILE && $mobile-rendering.data=="no-render")
 <!-- Movideo More Videos Module omitted on mobile -->
#else
 #renderMovideoMoreVideos()
#end