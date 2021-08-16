
export interface Cliente{
    uid: string;
    nombre: string;
    dni: string;
    email: string;
    celular: string;
    foto: string;
    referencia: string;
    ubicacion: any;
}
export interface Producto {
    nombre:string;
    precioNormal:number;
    precioReducido:number;
    foto:string;
    id:string;
    fecha:Date;
}

export interface Pedido{
    id:string;
    cliente: Cliente;
    productos:ProductoPedido[];
    precioTotal:number;
    fecha: Date;
    estado:EstadoPedido;
    valoracion:number
}


export interface ProductoPedido{
    producto:Producto;
    cantidad:number;
}

export type EstadoPedido = 'enviado' | 'visto' | 'camino' | 'entregado'
