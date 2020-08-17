import React from 'react';
import {Pressable, Modal, View} from 'react-native';
import Icon1 from 'react-native-vector-icons/MaterialIcons';
import ImageViewer from 'react-native-image-zoom-viewer';
export default function ViewAvatar({
  modalVisibleAvatar,
  setModalVisibleAvatar,
  data,
}) {
  return (
    <View>
      <Modal
        visible={modalVisibleAvatar}
        transparent={true}
        onRequestClose={() => setModalVisibleAvatar(false)}>
        <Pressable
          onPress={() => setModalVisibleAvatar(false)}
          style={{position: 'absolute', padding: 10}}>
          <Icon1 name="cancel" size={30} color="#fff" marginTop={5} />
        </Pressable>
        <ImageViewer
          imageUrls={[
            {
              props: {
                source:
                  data.avatar_url == null
                    ? require('../store/img/logo.png')
                    : null,
              },
              url: data.avatar_url,
            },
          ]}
          index={0}
          onSwipeDown={() => {
            setModalVisibleAvatar(false);
          }}
          onMove={(data) => console.log(data)}
          enableSwipeDown={true}
          style={{zIndex: -1}}
        />
      </Modal>
    </View>
  );
}
