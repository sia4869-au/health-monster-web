// src/components/ErrorBoundary.tsx
import React from "react";
import { View, Text } from "react-native";

export default class ErrorBoundary extends React.Component<any, {error:any}> {
  constructor(props:any){ super(props); this.state = { error: null }; }
  static getDerivedStateFromError(error:any){ return { error }; }
  componentDidCatch(error:any, info:any){ console.error(error, info); }
  render(){
    if(this.state.error){
      return (
        <View style={{flex:1,alignItems:'center',justifyContent:'center',padding:20}}>
          <Text style={{color:'#fff'}}>Runtime error: {String(this.state.error)}</Text>
        </View>
      );
    }
    return this.props.children;
  }
}
