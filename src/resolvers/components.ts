export const resolveComponent = (Components: any, component: any, route: any, i: number) : any => {
    const CompRaw = "function" === (typeof component) ? component : Components[component.id as keyof typeof Components]
    const compProps = "function" === (typeof component) ? {} : component
  
    // const mapStateToProps = (state: any) => {
    //   const data: any = {} 

    //   Object.keys(props.data).map((slice: string) => {
    //     // console.log(p)
    //     data[slice] = {
    //       update: (u: any) => {},
    //       list: (u: any) => [],
    //       dispatch: (type: string, update: any) => dispatch({ type, slice, data })
    //     }
    //   })

    //   return { data }
    // }

    // const Comp = connect(mapStateToProps)(CompRaw)
  
    // return (<div style={{
    //       backgroundColor: "#ffffff",
    //       width: "100%",
    //       margin: 0,
    //       padding: 0,
    //       display: "flex",
    //       flex: 1,
    //       flexDirection: "column",
    //       justifyContent: "center",
    //       alignItems: "center"
    //     }} key={`${i}`}>
    //         <Comp {...props} carmel={carmel} viewport={viewport} {...compProps} dispatch={dispatch}/>
    //     </div>)
}
