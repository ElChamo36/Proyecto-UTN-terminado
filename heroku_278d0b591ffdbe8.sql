
use heroku_278d0b591ffdbe8;
CREATE TABLE cliente(
id_cliente int unsigned not null auto_increment,
nombre varchar (45) not null,
apellido varchar (45) not null,
fecha_ingreso_consulta date not null,
fecha_egreso_consulta date not null,
dni  varchar (40) null,
mail varchar(255) not null,
telefono varchar (50) not null,
primary key (id_cliente)
);
alter table cliente modify dni varchar (40) not null;

CREATE TABLE reservas(
id_reserva int unsigned not null auto_increment,
nombre_reserva varchar (45) not null,
apellido_reserva varchar (45) not null,
dni_reserva varchar (40) null,
mail_reserva varchar(255) not null,
telefono_reserva varchar (50) not null,
fecha_ingreso_reserva date not null,
fecha_egreso_reserva date not null,
seña bigint unsigned not null,
monto bigint unsigned not null,
total_noches tinyint unsigned null,
PRIMARY KEY (id_reserva)
);