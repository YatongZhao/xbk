import React, { Component } from 'react';
import s from './create.css';
import { Images } from '../../News/index'
import axios from '../../../../api/axios.js'
import url from '../../../../api/url.js'
import Cookies from 'js-cookie'


class Create extends Component {
  constructor(props){
    super(props);
    this.state = {
      titleValue:'',
      contentValue:'',
      show:false,
      upload_success:false,
      images: []
    };

    this.fileInput = React.createRef();
    this.imgs = [];

    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handlePic = this.handlePic.bind(this);
    this.handleBack = this.handleBack.bind(this);
    this.dataURLToBlob = this.dataURLToBlob.bind(this);
    this.commpress = this.commpress.bind(this);
    this.postImage = this.postImage.bind(this);
  }

  handleBack () {
    let { history } = this.props
    if (history.length === 1) {
      history.replace('/')
    } else {
      history.goBack()
    }
  }

  handleChange(e){
    this.setState({[e.target.name + 'Value']: e.target.value});
  }

  async handleSubmit(){
    if (this.state.show && !this.state.upload_success){
      alert("图片正在上传中,请稍后提交");
      return;
    }
    let { match, history } = this.props
    let user_id = Cookies.get('user_id')
    let { code, data } = await axios({
      method: 'post',
      url: url.post,
      data: {
        user_id,
        star_id: match.params.star_id,
        title: this.state.titleValue,
        content: this.state.contentValue,
        imgs: this.imgs.join(';')
      }
    })
    if (code !== 0) return
    if (data.state === 'success') {
      history.push(`/star/${match.params.star_id}/community`)
    }
  }

  handlePic(){
    if (this.state.upload_success) this.setState({upload_success:false});
    let filebtn = this.fileInput.current;
    if (filebtn.files.length > 6){
      alert("上传图片不能超过6张");
      filebtn.value ='';
      return false;
    }
    if (! this.state.show) this.setState({show:true});
    const blobs = [];
    for (let i=0; i<filebtn.files.length;i++){
      blobs.push(this.commpress(filebtn.files[i]));
    }
    Promise.all(blobs).then(datas => {
      this.imgs = datas.map(item => item.imgid);
      this.setState({
        upload_success:true,
        images: datas.map(item => item.dataURL)
      });
    })
  }

  commpress(file){
    let that = this
    return new Promise((resolve, reject) =>{
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = function(){
        const size = 500
        const imgObj = new Image();
        imgObj.src = this.result;
        imgObj.onload = async (e) => {
          const canvas = document.createElement('canvas');
          if (imgObj.width > imgObj.height) {
            canvas.height = size
            canvas.width = canvas.height / imgObj.height * imgObj.width
          } else {
            canvas.width = size
            canvas.height = canvas.width / imgObj.width * imgObj.height
          }
          const ctx = canvas.getContext('2d');
          ctx.drawImage(imgObj, 0, 0, canvas.width, canvas.height);

          let params = new FormData()
          const dataURL = canvas.toDataURL();
          try {
            canvas.toBlob(blob => {
              let file = new File([blob], 'tempImg', {type: 'image/png', lastModified: Date.now()})
              params.append('uploadfile', file)
              return resolve(that.postImage(params, blob, dataURL))
            }, 'image/png', 0.5)
          } catch (error) {
            const blob = that.dataURLToBlob(dataURL)
            let file = new File([blob], 'tempImg', {type: 'image/png', lastModified: Date.now()})
            params.append('uploadfile', file)
            return resolve(that.postImage(params, blob, dataURL))
          }
        }
      }
    });
  }

  async postImage (params, blob, dataURL) {
    let { code, data } = await axios({
      method: 'post',
      url: url.image,
      headers: {
        'Content-Type': 'multipart/form-data'
      },
      data: params
    })
    if (code !== 0) return code
    return { blob, dataURL, imgid: data.data.imgid }
  }

  blobToDataURL (blob) {
    return new Promise((resolve, reject) => {
      let a = new FileReader()
      a.onload = (e) => { resolve(e.target.result) }
      a.readAsDataURL(blob)
    })
  }

  
  dataURLToBlob (dataurl) {
    let arr = dataurl.split(',')
    let mime = arr[0].match(/:(.*?);/)[1]
    let bstr = atob(arr[1])
    let n = bstr.length
    let u8arr = new Uint8Array(n)
    while (n--) {
      u8arr[n] = bstr.charCodeAt(n)
    }
    return new Blob([u8arr], {type: mime})
  }

  render() {
    return (
      <div className={s.create}>
        <form className={s.form}>
          <div className={s.post_btns}>
              <span className={s["btn_cancel"]} onClick={this.handleBack}>取消</span>
              <span className={s["btn_center"]}>发帖子</span>
              <span className={s["btn_create"]} onClick={this.handleSubmit}>发表</span>
          </div>
          <input name="title" type="text" value={this.state.titleValue} onChange={this.handleChange} placeholder="请输入标题" className={s.title} />
          <textarea name="content" value={this.state.contentValue} onChange={this.handleChange} placeholder="点击这里输入内容" className={s.post_content}></textarea>
          <Images images={this.state.images} style={{margin: '.2rem 1.4rem 1rem .2rem'}}></Images>
          <div className={s.file_btn}>
            <img src={require('../../../../static/image/picture.png')} className={s.file_icon} alt="上传图片" />
            <input type="file" onChange={this.handlePic} multiple accept="image/*" className={s.btn} ref={this.fileInput} />
            {this.state.show? (<span className={s.upload}>{this.state.upload_success?"图片上传成功":"图片上传中..."}</span>) : null}
          </div>
        </form>
      </div>
    );
  }
}

export default Create;
