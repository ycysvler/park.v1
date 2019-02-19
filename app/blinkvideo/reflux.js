import Reflux from 'reflux';
import propx from '../http/proxy';
import Config from 'config';
import {UserActions, UserStore} from '../system/user/userapi.js';

const VideoActions = Reflux.createActions([
        'face',
        'showVideo',
        'showAudio',
        'videoInvitation',
        'audioInvitation'
    ]
);

const VideoStore = Reflux.createStore({
    listenables: [VideoActions],

    onVideoInvitation:function(groupId, employee){
        let url = Config.url + "/service/user/groupVideoInvitations";

        let param = {groupId:groupId, employee:employee};

        propx.post(url, param, (code, data) => {
            document.log('video > reflux > videoInvitation > param & code & data', param, code, data);

            self.trigger('videoInvitation', {data:data});
        });
    },

    onAudioInvitation:function(groupId, employee){
        let url = Config.url + "/service/user/groupVoiceInvitations";

        let param = {groupId:groupId, employee:employee};

        propx.post(url, param, (code, data) => {
            document.log('video > reflux > videoInvitation > param & code & data', param, code, data);

            self.trigger('videoInvitation', {data:data});
        });
    },

    onShowVideo:function(groupId){
      this.trigger('showVideo', groupId);
    },
    // 刷新列表
    onFace: function (base64Img) {
        var self = this;
        var url = Config.base + '/api/search';

        var param = {"base64Img": base64Img};

        $.ajax(
            {
                url: url,
                type: "POST",
                data: JSON.stringify(param),
                cache: false,
                contentType: "application/json;charset=utf-8",
                processData: false,
                dataType: "json",
                success: function (data, status) {
                    self.trigger('face', data);
                    self.trigger('create', data);
                },
                error: function (reason) {
                    console.log('error', reason);
                }
            }
        );
    }
});


exports.VideoActions = VideoActions;
exports.VideoStore = VideoStore;
