import React, {Fragment,Component,useRef} from 'react';
import {Text, StyleSheet, View,AppState, TextInput,Dimensions, StatusBar, TouchableOpacity,FlatList,ImageBackground,Linking, Alert} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {connect} from "react-redux"
import axios from "axios"
import * as Animatable from 'react-native-animatable';
import AntDesign from "react-native-vector-icons/AntDesign";
import Entypo from "react-native-vector-icons/Entypo"
import FontAwesome5 from "react-native-vector-icons/FontAwesome5"
import FontAwesome from "react-native-vector-icons/FontAwesome"
import MaterialIcons from "react-native-vector-icons/MaterialIcons"
import Fontisto from "react-native-vector-icons/Fontisto";
import AsyncStorage from "@react-native-async-storage/async-storage";
import {handlecancel,shownotification,channeliddate} from "./notification.android";




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
    alert:1,
    noti:3,
    states:[],
    statekey:null,
    district:[],
    districtkey:'',
    selectstate:"Select State",
    selectdistrict:"Select District",
    pinmode:false,
    pincode:'',
    notify:false,
    vaccineAvailablity:false,
    avail:null,
    appstate:AppState.currentState
  }
  }


 

checkuser =() =>{



//  AsyncStorage.clear()

    AsyncStorage.getItem('data').then(res => {

  

   if(res){
    try{

      if(res){

        if(res !== undefined && res != null)
          var data =  JSON.parse(res)
          var data1 = {...data,notify:true}

         this.setState({...data1})
         

      }else{
       this.setState({vaccineAvailablity:false})
      }
    
    }catch(error){console.log(error)}
    
     
  }else{
    this.setState({
      avail:null,
      vaccineAvailablity:false
    })
  }

})


}

 componentWillUnmount(){
   AppState.removeEventListener('change',this.handleappstate)
 }

 handleappstate = (nextappstate) =>{
   this.setState({appstate:nextappstate});

   if(nextappstate === 'background'){
     console.log("app in background")
     setTimeout(() => this.fetchdata(),2000);
     
     

     
   }
   if(nextappstate === 'active'){
    console.log("app in active")
    setTimeout(() => this.fetchdata(),2000);
    
   }
   if(nextappstate === 'inactive'){
    setTimeout(() => this.fetchdata(),2000);

   }
 }
  

componentDidMount(){


  

// AsyncStorage.clear()

// channeliddate('1')

// shownotification("1" , "✔✔💉 Vaccine Available Now", "Vaccine available at your saved location . Open app to view available slots")



   if(!this.state.avail === null  && this.state.noti < 4){
    channeliddate('1')
  
    shownotification("1" , "✔✔💉 Vaccine Available Now", "Vaccine available at your saved location . Open app to view available slots")
   
this.setState({noti:this.state.noti + 1})
   }
  

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




this.checkuser()
AppState.addEventListener('change',this.handleappstate)


}




componentDidUpdate(){

}


async fetchdata(){


 
    
    


  var d = new Date();
  var options = {
  year: "numeric",
  month: "2-digit",
  day: "2-digit"
  }

  

  var tommdate = d.getDate() + 1

  
  var date = String(d.toLocaleDateString("en", options));
  var newdate = date.replace(/\//g, "-");
  

  var month = newdate.slice(0,2)
  var date = newdate.slice(3,5)
  var year = newdate.slice(6,newdate.length)

 
try{
  var joinavail = [];
  var pinjoin = [];


  if(this.state.states.length <= 0 ){
    alert('Select State')
  }else if(this.state.district.length <= 0 && !this.state.pinmode){
    alert('Select State & District to Continue')
  }

  if(this.state.avail){
    
   if(this.state.avail.length < 1){
     alert('No Vaccine Available Now ,we will notify you soon when it available')
   }
  }

  if(this.state.selectdistrict){
await instance.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${this.state.selectdistrict}&date=${date}-${month}-${year}`).then(e=> e.data).then(res =>{
    
      var av = res.sessions.filter(es => es.available_capacity > 0)


   instance.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByDistrict?district_id=${this.state.selectdistrict}&date=${tommdate}-${month}-${year}`).then(en=> en.data).then(res1 =>{

      var av1 =  res1.sessions.filter(es => es.available_capacity > 0)


      if(av && av1){



        joinavail = [...av,...av1];

         joinavail.sort((a,b) => a.min_age_limit > b.min_age_limit ? 1 : -1 )
         
     

        this.setState({
         avail:joinavail,
          vaccineAvailablity:true,
          notify:true
         })

         

         

        

         AsyncStorage.setItem('data',JSON.stringify(this.state)).then((value)=> {

        }).catch(error => console.log(error))

        if(this.state.alert == 1){
          alert('Thank you Notified me ,we will show you real time vaccine availabilty at your given location ,if you want to go cowin site for BOOK APPOINTMENT so just click on any of available list,else want to go homepage so tap on reset button will show at top')
          
          this.setState({
            alert:this.state.alert +1
          })


         
         
        }
      console.log(joinavail)
  setTimeout(() => this.fetchdata(),2000);




      }else if(av || av1 === 0){
        this.setState({
          vaccineAvailablity:false
        })
      }




      if(this.state.avail){
        
       if(this.state.avail.length < 1){
        
        channeliddate('1')
       shownotification("1" , "✔✔💉No Vaccine Available Now", " No Vaccine available at your saved location . Open app to view available slots")
 
        Alert.alert('Want to stay here ?','No Vaccine Available Now ,we will notify you soon when it available, if you  click on yes then we will alert you at your search history basis,if you click on go back then we move on previos page and search new location',[{text:'Go Back',onPress: ()=>{ this.resetchange() },style:'cancel'},{text:'Yes',onPress:()=>  {}}])

      }else{

        if(this.state.noti < 4){
          channeliddate('1')
          shownotification("1" , "✔✔💉 Vaccine Available Now", "Vaccine available at your saved location . Open app to view available slots")
          this.setState({noti:this.state.noti + 1})
        }
        
        
      }
      }





      if(this.state.alert == 1){
        this.setState({alert:this.state.alert + 1})

       

      }

      if(this.state.avail = null && this.state.avail.length < 1 && this.state.district.length > 0){
        alert('No Vaccine Available Now ,we will notify you soon when it available')
        this.setState({
          vaccineAvailablity:false
        })
        
        channeliddate('1')
       shownotification("1" , "✔✔💉 No Vaccine Available Now", " No Vaccine available at your saved location . Open app to view available slots")
 
      }

     




      
      }).catch(e=> console.log("cvhh"))
  
   //  
  })
  }}catch(error){console.log()}

  
  if(this.state.pincode.length < 6 && this.state.pincode > 0 && this.state.pinmode){
    alert('Enter Correct 6 Digit Pincode')
  }

  if(this.state.pinmode){
    if(!this.state.pincode){
      alert("Enter Correct Pincode")
    }
  }
  


 await instance.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${this.state.pincode}&date=${date}-${month}-${year}`).then(e=> e.data).then(resw =>{
   
         
  var avpin = resw.sessions.filter(es => es.available_capacity > 0)
   
  instance.get(`https://cdn-api.co-vin.in/api/v2/appointment/sessions/public/findByPin?pincode=${this.state.pincode}&date=${tommdate}-${month}-${year}`).then(e=> e.data).then(resss =>{


  var avpin2 = resss.sessions.filter(es => es.available_capacity > 0)

   pinjoin = [...avpin ,...avpin2]

   pinjoin.sort((a,b) => a.min_age_limit > b.min_age_limit ? 1 : -1 )
        
     

    if(avpin && avpin2){
      this.setState({
        avail:pinjoin,
        vaccineAvailablity:true,
        notify:true
      }) 

    
     

      AsyncStorage.setItem('data',JSON.stringify(this.state)).then((value)=> {

      }).catch(error => console.log(error))

      if(this.state.alert == 1){
        alert('Thank you Notified me ,we will show you real time vaccine availabilty at your given location , if you want to go cowin site for BOOK APPOINTMENT so just click on any of available list , else want to go homepage so tap on reset button will show at top')
        
        this.setState({
          alert:this.state.alert +1
        })


       
       
      }
    
  //  setTimeout(() => this.fetchdata(),2000);




    }else if(avpin || avpin2 === 0){
      this.setState({
        vaccineAvailablity:false
      })
    }



    if(this.state.avail){
      
     if(this.state.avail.length < 1){
      
      Alert.alert('Want to stay here ?','No Vaccine Available Now ,we will notify you soon when it available, if you  click on yes then we will alert you at your search history basis,if you click on go back then we move on previos page and search new location',[{text:'Go Back',onPress: ()=>{ this.resetchange() },style:'cancel'},{text:'Yes',onPress:()=>  {}}])

      channeliddate('1')
      shownotification("1" , "✔✔💉 No Vaccine Available Now", " No Vaccine available at your saved location . Open app to view available slots")

    
     }else{

      if(this.state.noti < 4 ){
        channeliddate('1')
        shownotification("1" , "✔✔💉 Vaccine Available Now", "Vaccine available at your saved location . Open app to view available slots")
        this.setState({noti:this.state.noti + 1})
      }
       
     
     }
    }



      

      
    if(this.state.alert == 1){
      this.setState({alert:this.state.alert + 1})

     

    }

    if(this.state.avail = null && this.state.avail.length < 1 && this.state.pincode.length > 0){
      alert('No Vaccine Available Now ,we will notify you soon when it available')
      
      channeliddate('1')
      shownotification("1" , "✔✔💉 No Vaccine Available Now", "No Vaccine available at your saved location . Open app to view available slots")

      this.setState({
        vaccineAvailablity:false
      })
    }else{
      if(this.state.noti < 4)
      channeliddate('1')
      shownotification("1" , "✔✔💉  Vaccine Available Now", "Vaccine available at your saved location . Open app to view available slots")
      this.setState({noti:this.state.noti + 1})
    }
      
      
    })

   }).catch((err)=> console.log(err))
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

  shouldComponentUpdate(){
    return true
  }


  renderitemdata = (item ,index) =>{   
    return <TouchableOpacity onPress={()=> Linking.openURL('https://selfregistration.cowin.gov.in/')}  key={index}>
    <View style={{width:'96%',height:190,backgroundColor:'white',margin:'2%',borderRadius:20,flexDirection:'row',position:'relative'}}>
 
    <View style={{width:'33%',height:'100%',borderRadius:20,position:'relative',}}>
      <View style={{width:"100%",height:"50%",flexDirection:'row',justifyContent:'center',alignItems:'center',paddingTop:7}}>
        <View style={{width:70,height:70,backgroundColor:'#E1ECD5',borderRadius:19,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:30,fontWeight:'bold',color:'#3B5922'}}>{item.available_capacity}</Text>
        </View>
        
      </View>
      <View style={{width:"100%",height:"50%",position:'relative'}}>
      {/* <Text style={{fontSize:10,textAlign:'center',fontWeight:'bold'}}>{`Dose1 0 |  Dose2 0`}</Text> */}
      <View style={{justifyContent:'center',alignItems:'center',marginTop:10}}>

      {item.min_age_limit == 18  ?   <View style={{width:70,height:70,backgroundColor:'#F0D1D2',borderRadius:19,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:22,fontWeight:'bold',color:'#B93C40'}}>{item.min_age_limit}+</Text>
        </View> :   <View style={{width:70,height:70,backgroundColor:'#132A13',borderRadius:19,justifyContent:'center',alignItems:'center'}}>
          <Text style={{fontSize:22,fontWeight:'bold',color:'white'}}>{item.min_age_limit}+</Text>
        </View> }
    
    
        
        
        
        </View>
      </View>
    </View>
    <View style={{width:'67%',height:'100%',padding:10,flexWrap:'wrap',position:'relative'}}>
      <View style={{flexDirection:'row',justifyContent:'space-around'}}><Text style={{fontSize:10,marginLeft:-45}}>Center : {item.center_id}</Text><Text style={{fontSize:10 ,alignItems:'flex-end',fontWeight:'bold'}}>{item.date}</Text></View>
    <View style={{flexDirection:'row',paddingTop:5,width:'87%',position:'relative'}}>
    <FontAwesome5 name='hospital' style={{padding:10,paddingLeft:1}} size={17} color='black' />
      <Text numberOfLines={2} style={{fontSize:18,fontWeight:'bold',flexWrap:'wrap' ,width:'87%'}}>{item.name}</Text>
    </View>
    <View style={{flexDirection:'row'}}>
    <MaterialIcons name='add-location-alt' style={{padding:7,paddingLeft:1}} size={17} color='black' />
      <Text numberOfLines={2} style={{fontSize:13,fontWeight:'normal',flexWrap:'wrap' ,width:'68%',paddingTop:7,flexWrap:'wrap'}}>{item.address + `   ${item.pincode}`}</Text>
    </View>
    <View style={{flexDirection:'row'}}>
    <FontAwesome name='rupee' style={{padding:10,paddingBottom:6,paddingLeft:6}} size={15} color='black' />
      <Text style={{fontSize:13,fontWeight:'bold',flexWrap:'wrap' ,width:'87%',paddingTop:7}}>{item.fee_type ==='Free'||'free' ? "Free" : item.fee}</Text>
    </View>
    <View style={{flexDirection:'row',position:'relative'}}>
    <Fontisto name='injection-syringe' style={{paddingLeft:4,paddingTop:8}} size={15} color='black' />
     
     <View style={{width:"60%",height:30,marginLeft:10,backgroundColor:'#ABD289',borderRadius:10,alignItems:'center',justifyContent:'center',position:'relative'}}><Text style={{fontSize:13,fontWeight:'bold',flexWrap:'wrap', textAlign:'center',width:'87%',color:"#31572C"}}>{item.vaccine}</Text></View>
    </View>
    </View>
  
      {/* <AntDesign name='checkcircleo' />
    <FontAwesome5 name='hospital' size={30} color='black' /> */}
  
    </View>
    </TouchableOpacity>
 
    
  }


  resetchange = () =>{
  
    AsyncStorage.setItem('data',JSON.stringify([])).then(e=>{
      this.setState({
      
  
   noti:3,
    district:[],
    districtkey:'',
    selectstate:"Select State",
    selectdistrict:"Select District",
    pinmode:false,
    pincode:'',
    
    vaccineAvailablity:false,
    avail:null,
      })
    })
  }

  
  render() {
    
    

 return (
      <Fragment>
      <StatusBar hidden={false} backgroundColor='#CDE1AC' barStyle="dark-content" translucent={true} />
      
         <View style={{width:'100%',height:"100%",backgroundColor:'#BBDFC5'}}>

         <ImageBackground resizeMode="cover" source={require('../bgcovid.jpg')} style={{width:'100%' , height:'100%'}} imageStyle={{opacity:0.3,borderRadius:20}}>


{this.state.vaccineAvailablity ? <View style={{backgroundColor:'#E7EEE9'}}>

<View style={{padding:10}}>
  <View style={{marginTop:"8.1%",width:'96%',height:80,backgroundColor:"#fff",margin:"2%",borderRadius:20,justifyContent:'center',alignItems:'center'}}><Text  style={{fontSize:20,fontWeight:"bold",color:'#3B5922'}}>Vaccine Available Now</Text>{this.state.notify ? <TouchableOpacity onPress={()=> this.resetchange()}><Text styel={{fontWeight:'bold'}}>Reset location ?</Text></TouchableOpacity> : null }</View>
  <View style={{marginBottom:"95%"}}>
  <FlatList removeClippedSubviews={true} data={this.state.avail} showsHorizontalScrollIndicator={false} showsVerticalScrollIndicator={false} keyExtractor={(item,index) => index } renderItem={({item,index})=> this.renderitemdata(item,index)
   
 } /></View>
  
</View>
</View> : <Fragment>
  
{this.state.pinmode ? 
           
           <View style={{marginTop:'20%'}}></View> : <View style={{position:'relative',top:"10%",width:windowWidth,height:"30%",alignItems:'center'}}><Text style={{marginBottom:5,width:"70%",fontSize:windowHeight/30,textDecorationStyle:'dotted',fontWeight:'bold',textAlign:'center',marginTop:"5%"}}>We will Take responsiblity to Notify you</Text>
           
           
           
           
           </View>
     }
     <View style={{width:windowWidth,height:"70%",justifyContent:"flex-end"}}>

     <View style={{width:"96%",position:'relative',backgroundColor:'#E7EEE9',margin:'2%',borderRadius:20,paddingBottom:'8%'}}>
           

           { this.state.pinmode ? <View style={{paddingTop:"10%"}}><Text style={{fontSize:40,fontWeight:'bold',textAlign:'center'}}>{`Enter Your\n6 Digit Pincode`}</Text><Text style={{textAlign:'center'}}>..........................................</Text><View style={{margin:"7%",marginBottom:'2%', marginTop:'17%'}}><Text style={{fontSize:15,marginBottom:10,fontWeight:'bold',textAlign:'center'}}>Enter Correct Pincode to Fetch Availabilty</Text>
   
   
           <View style={{flexDirection:'row'}}>
   
           <TextInput  ref={"pin1ref"} autoFocus={true} onChangeText={(value) => {this.setState({pincode:value})}} value={this.state.pincode} style={{letterSpacing:10,borderWidth:2,margin:5,borderColor:'black',borderRadius:10, backgroundColor:'white',padding:3,width:'98%',height:70,textAlign:'center',fontSize:30,fontWeight:'bold'}} keyboardType='number-pad' maxLength={6}></TextInput>
       
           </View>
           <TouchableOpacity onPress={()=> this.setState({pinmode:false})} style={{padding:'3%'}}><Text style={{textAlign:'center',fontSize:13,fontWeight:'bold',color:'#FF8585'}}>I Knew State & District !</Text></TouchableOpacity>
            
           
           </View></View> : <View>
             <Text style={{fontSize:20,fontWeight:'bold',margin:'5%',marginLeft:"10%"}}>Covid Vaccine Availablity</Text>
            <View style={{margin:"10%",marginBottom:"0%", marginTop:'1%'}}>
              <Text style={{fontSize:15,marginBottom:10,fontWeight:'bold'}}>Select State</Text>
              <TouchableOpacity style={{backgroundColor:"white",borderRadius:10,borderWidth:2 ,borderColor:'black'}}>
               <Picker style={{width:'98%',height:70}}
          selectedValue={this.state.selectstate}
          itemStyle={{backgroundColor:"grey" ,color:'white',borderWidth:4,borderColor:'red'}}
          onValueChange={value => this.changedata(value)}>
   <Picker.Item enabled={false} col label="Select State" value="Select" />
         {this.statevalue()}
        </Picker>
          
               
              </TouchableOpacity>
   
            
              </View>
   
   
              <View style={{margin:"10%",marginBottom:"3%", marginTop:'4%'}}>
              <Text style={{fontSize:15,marginBottom:10,fontWeight:'bold'}}>Select District</Text>
              <TouchableOpacity style={{backgroundColor:"white",borderRadius:10,borderWidth:2 ,borderColor:'black'}}>
               <Picker style={{width:'98%',height:70}}
          selectedValue={this.state.selectdistrict}
          itemStyle={{backgroundColor:"grey" ,color:'white',borderWidth:4,borderColor:'red',position:'absolute',zIndex:9999999999}}
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
   
   
   
              <TouchableOpacity onPress={()=> this.fetchdata()} style={{height:windowHeight/11,backgroundColor:"black",justifyContent:'center',alignItems:'center',borderRadius:10,borderWidth:2 ,borderColor:'black',width:'96%',marginLeft:"2%",position:'relative',top:'3%'}}>
             
          <Text style={{color:'white',fontSize:20}}> Sync & Save </Text>
               
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

 module.exports = App;
