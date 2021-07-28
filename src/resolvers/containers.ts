export const resolveContainer = (route: any) => {
    // const containerId: keyof typeof Containers = (route.type || "main").charAt(0).toUpperCase() + (route.type || "main").toLowerCase().substring(1)
    // const Cont = Containers[containerId] 

    // return (<Cont {...props} {...route}>
    //     { route.components.map((component: any, i: number) => renderComponent(component, route, i)) }
    // </Cont>)
}

  // const renderComponent = (component: any, route: any, i: number) : any => {
  //   const CompRaw = "function" === (typeof component) ? component : components[component.id as keyof typeof components]
  //   const compProps = "function" === (typeof component) ? {} : component
  
  //   const mapStateToProps = (state: any) => {
  //     const data: any = {} 

  //     Object.keys(props.data).map((slice: string) => {
  //       // console.log(p)
  //       data[slice] = {
  //         update: (u: any) => {},
  //         list: (u: any) => [],
  //         dispatch: (type: string, update: any) => dispatch({ type, slice, data })
  //       }
  //     })

  //     return { data }
  //   }

  //   const Comp = connect(mapStateToProps)(CompRaw)
  
  //   return (<div style={{
  //         backgroundColor: "#ffffff",
  //         width: "100%",
  //         margin: 0,
  //         padding: 0,
  //         display: "flex",
  //         flex: 1,
  //         flexDirection: "column",
  //         justifyContent: "center",
  //         alignItems: "center"
  //       }} key={`${i}`}>
  //           <Comp {...props} carmel={carmel} viewport={viewport} {...compProps} dispatch={dispatch}/>
  //       </div>)
  // }

  // const Container = (route: any) => {
  //   const containerId: keyof typeof containers = (route.type || "main").charAt(0).toUpperCase() + (route.type || "main").toLowerCase().substring(1)
  //   const Cont = containers[containerId] 

  //   return (<Cont {...props} {...route}>
  //       { route.components.map((component: any, i: number) => renderComponent(component, route, i)) }
  //   </Cont>)
  // }