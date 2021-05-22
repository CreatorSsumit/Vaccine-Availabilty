import React, {Fragment,Component} from 'react';
import {Text, StyleSheet, View, TextInput,Dimensions, StatusBar, TouchableOpacity,FlatList,ImageBackground} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {connect} from "react-redux"
import axios from "axios"
import * as Animatable from 'react-native-animatable';
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Fontisto from "react-native-vector-icons/Fontisto"

var instance = axios.create({
  headers:{
    'Accept-Encoding':'gzip,deflate,br',
'Connection':'keep-alive',
'Accept-Language':'hi_IN',
'Accept':'application/json',
'User-Agent':'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/90.0.4430.93 Safari/537.36'

  }
})







const stateapi = 'https://cdn-api.co-vin.in/api/v2/admin/location/states'
const districtapi = 'https://cdn-api.co-vin.in/api/v2/admin/location/districts'
const pincodeapi = 'https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=110001&date=31-03-2021'

const windowWidth = Dimensions.get('window').width;
const windowHeight = Dimensions.get('window').height;



 class App extends Component {

  constructor(props){
  super(props);
  this.state={
    states:[],
    statekey:null,
    district:[],
    districtkey:'',
    selectstate:"Select State",
    selectdistrict:"Select District",
    pinmode:false,
    pincode:null,
    vaccineAvailablity:true,
    avail:[]
  }
  }
  

componentDidMount(){
var d = new Date();
var options = {
year: "numeric",
month: "2-digit",
day: "2-digit"
}

var date = String(d.toLocaleDateString("en", options));
date = date.replace(/\//g, "-");

 
  instance.get(stateapi).then(e=> e.data).then(res =>{
    
  if(res) this.setState({
    states:res.states
  })
})



}


async fetchdata(){


  var d = new Date();
  var options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
  }
  
  var date = String(d.toLocaleDateString("en", options));
  newdate = date.replace(/\//g, "-");
  

  var month = newdate.slice(0,2)
  var date = newdate.slice(3,5)
  var year = newdate.slice(6,newdate.length)

try{

  if(this.state.selectdistrict){
    await instance.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${this.state.selectdistrict}&date=${date}-${month}-${year}`).then(e=> e.data).then(res =>{
    
      var av = res.sessions.filter(es => es.available_capacity > 0)
       if(av){
     this.setState({
       avail:av
     })
       }


     
       
//  setTimeout(() => this.fetchdata(),1000);
 
     
       
       })
  }
   
  
    }catch(error){
      console.log(error)
    }
  }




statevalue = () =>{

 return this.state.states.map((data,index) =>{
   
  return(
    <Picker.Item label={data.state_name} key={data.state_id} value={data.state_id} />
  )
 })
}
changedata = value => {
let d =  this.state.states.filter(e => e.state_id === value)
if(d){
  instance.get(districtapi+"/"+value).then(e=> e.data).then(res =>{
    this.setState({selectstate:d,
    district:res.districts,

  
  }) })}
}

changedatadistrict = value => {
 
  this.setState({
    districtkey:value,
    selectdistrict:value
  })

  
 
  }
  



  render() {
    
    

 return (
      <Fragment>
      <StatusBar hidden={false} backgroundColor='#CDE1AC' barStyle="dark-content" translucent={true} />
      
         <View style={{width:'100%',height:"100%",backgroundColor:'#BBDFC5'}}>

         <ImageBackground resizeMode="cover" source={require('../bgcovid.jpg')} style={{width:'100%' , height:'100%'}} imageStyle={{opacity:0.3,borderRadius:20}}>


{this.state.vaccineAvailablity ? <View>

<View style={{padding:10}}>
  <View style={{marginTop:"8%",width:'96%',height:80,backgroundColor:"#fff",margin:"2%",borderRadius:20,justifyContent:'center',alignItems:'center'}}><Text  style={{fontSize:20,fontWeight:"bold",color:'#3B5922'}}>Vaccine Available Now</Text></View>
  
  <View style={{width:'96%',height:190,backgroundColor:'white',margin:'2%',borderRadius:20,flexDirection:'row',position:'relative'}}>

  <View style={{width:'33%',height:'100%',borderRadius:20,position:'relative',}}>
    <View style={{width:"100%",height:"50%",flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:7}}>
      <View style={{width:70,height:70,backgroundColor:'#E1ECD5',borderRadius:19,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:30,fontWeight:'bold',color:'#3B5922'}}>26</Text>
      </View>
      
    </View>
    <View style={{width:"100%",height:"50%",position:'relative'}}>
    {/* <Text style={{fontSize:10,textAlign:'center',fontWeight:'bold'}}>{`Dose1 0 |  Dose2 0`}</Text> */}
    <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>
    <View style={{width:70,height:70,backgroundColor:'#132A13',borderRadius:19,justifyContent:'center',alignItems:'center'}}>
        <Text style={{fontSize:22,fontWeight:'bold',color:'white'}}>18+</Text>
      </View></View>
    </View>
  </View>
  <View style={{width:'67%',height:'100%',padding:10,flexWrap:'wrap',position:'relative'}}>
    <View style={{flexDirection:'row',justifyContent:'space-around'}}><Text style={{fontSize:10,marginLeft:-45}}>Center</Text><Text style={{fontSize:10 ,alignItems:'flex-end'}}>31-05-2021</Text></View>
  <View style={{flexDirection:'row',paddingTop:5,width:'87%',position:'relative'}}>
  <FontAwesome5 name='hospital' style={{padding:10,paddingLeft:1}} size={17} color='black' />
    <Text style={{fontSize:18,fontWeight:'bold',flexWrap:'wrap' ,width:'87%'}}>Gov hr sec school mandideep</Text>
  </View>
  <View style={{flexDirection:'row'}}>
  <MaterialIcons name='add-location-alt' style={{padding:7,paddingLeft:1}} size={17} color='black' />
    <Text style={{fontSize:13,fontWeight:'normal',flexWrap:'wrap' ,width:'68%',paddingTop:7,flexWrap:'wrap'}}>Gov hr sec school mandideep bhopal</Text>
  </View>
  <View style={{flexDirection:'row'}}>
  <FontAwesome name='rupee' style={{padding:10,paddingBottom:6,paddingLeft:6}} size={15} color='black' />
    <Text style={{fontSize:13,fontWeight:'bold',flexWrap:'wrap' ,width:'87%',paddingTop:7}}>Free</Text>
  </View>
  <View style={{flexDirection:'row',position:'relative'}}>
  <Fontisto name='injection-syringe' style={{paddingLeft:4,paddingTop:8}} size={15} color='black' />
   
   <View style={{width:"60%",height:30,marginLeft:10,backgroundColor:'#ABD289',borderRadius:10,alignItems:'center',justifyContent:'center',position:'relative'}}><Text style={{fontSize:13,fontWeight:'bold',flexWrap:'wrap', textAlign:'center',width:'87%',color:"#31572C"}}>Covaxin</Text></View>
  </View>
  </View>

    {/* <AntDesign name='checkcircleo' />
  <FontAwesome5 name='hospital' size={30} color='black' /> */}

  </View>
  
</View>









</View> : <Fragment>
  
{this.state.pinmode ? 
           
           <View style={{marginTop:'20%'}}></View> : <View style={{justifyContent:'center',width:windowWidth,height:windowHeight/3.1}}><Text style={{padding:20,width:"100%",fontSize:40,textDecorationStyle:'dotted',fontWeight:'bold',textAlign:'center'}}>We will Take responsiblity to Notify you</Text>
           
           
           
           
           </View>
     }
     <View style={{width:windowWidth,height:windowHeight}}>

     <View style={{width:"96%",position:'relative',justifyContent:'center',backgroundColor:'#E7EEE9',margin:'2%',borderRadius:50}}>
           

           { this.state.pinmode ? <View style={{paddingTop:'26%'}}><Text style={{fontSize:40,fontWeight:'bold',textAlign:'center'}}>{`Enter Your\n6 Digit Pincode`}</Text><Text style={{textAlign:'center'}}>..........................................</Text><View style={{margin:"7%",marginBottom:'2%', marginTop:'60%'}}><Text style={{fontSize:15,marginBottom:10,fontWeight:'bold',textAlign:'center'}}>Enter Correct Pincode to Fetch Availabilty</Text>
   
   
           <View style={{flexDirection:'row'}}>
   
           <TextInput  ref={"pin1ref"} autoFocus={true} onChangeText={(value) => {}}  style={{letterSpacing:10,borderWidth:2,margin:5,borderColor:'black',borderRadius:10, backgroundColor:'white',padding:3,width:'98%',height:70,textAlign:'center',fontSize:30,fontWeight:'bold'}} keyboardType='number-pad' maxLength={6}></TextInput>
       
           </View>
           <TouchableOpacity onPress={()=> this.setState({pinmode:false})} style={{paddingTop:'7%'}}><Text style={{textAlign:'center',fontSize:13,fontWeight:'bold',color:'#FF8585'}}>I Knew State & District !</Text></TouchableOpacity>
            
           
           </View></View> : <View>
             <Text style={{fontSize:20,fontWeight:'bold',margin:'10%'}}>Covid Vaccine Availablity</Text>
            <View style={{margin:"10%", marginTop:'1%'}}>
              <Text style={{fontSize:15,marginBottom:10,fontWeight:'bold'}}>Select State</Text>
              <TouchableOpacity style={{backgroundColor:"white",borderRadius:10,borderWidth:2 ,borderColor:'black'}}>
               <Picker style={{width:'98%',height:70}}
          selectedValue={this.state.selectstate}
         
          onValueChange={value => this.changedata(value)}>
   
            
          <Picker.Item enabled={false} col label="Select State" value="Select" />
         {this.statevalue()}
        
        </Picker>
          
               
              </TouchableOpacity>
   
            
              </View>
   
   
              <View style={{margin:"10%", marginTop:'1%'}}>
              <Text style={{fontSize:15,marginBottom:10,fontWeight:'bold'}}>Select District</Text>
              <TouchableOpacity style={{backgroundColor:"white",borderRadius:10,borderWidth:2 ,borderColor:'black'}}>
               <Picker style={{width:'98%',height:70}}
          selectedValue={this.state.selectdistrict}
          itemStyle={{backgroundColor:"grey" ,color:'white',borderWidth:4,borderColor:'red'}}
          onValueChange={value => this.changedatadistrict(value)} >
          <Picker.Item  enabled={false} label="Select District" value="Select" />
          {this.state.district ? this.state.district.map((data) => {
            return   <Picker.Item key={data.district_id} label={data.district_name} value={data.district_id} />
          }) :  <Picker.Item enabled={false} label="Select District" value="disable" /> }
         
        </Picker>
          
               
              </TouchableOpacity>
              </View>
   
              <TouchableOpacity onPress={()=> this.setState({pinmode:true})} style={{padding:7}}><Text style={{textAlign:'center',fontSize:13,fontWeight:'bold',color:'#FF8585'}}>I Have A Pincode !</Text></TouchableOpacity>
              </View>
    }
   
   
   
              <TouchableOpacity onPress={()=> this.fetchdata()} style={{height:windowHeight/11,backgroundColor:"black",justifyContent:'center',alignItems:'center',margin:"10%", marginTop:'10%',borderRadius:10,borderWidth:2 ,borderColor:'black'}}>
             
          <Text style={{color:'white',fontSize:20}}>Notifying me</Text>
               
              </TouchableOpacity>
               </View>
          









     </View>
         
          
</Fragment> }
        
           
           </ImageBackground>    
       
         </View>
       
       
         </Fragment>
      
          
    )
  }
}

 

const styles = StyleSheet.create({
 
});

export default App;