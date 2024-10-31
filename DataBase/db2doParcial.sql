-- MySQL Script generated by MySQL Workbench
-- mar 29 oct 2024 17:45:37
-- Model: New Model    Version: 1.0
-- MySQL Workbench Forward Engineering

SET @OLD_UNIQUE_CHECKS=@@UNIQUE_CHECKS, UNIQUE_CHECKS=0;
SET @OLD_FOREIGN_KEY_CHECKS=@@FOREIGN_KEY_CHECKS, FOREIGN_KEY_CHECKS=0;
SET @OLD_SQL_MODE=@@SQL_MODE, SQL_MODE='ONLY_FULL_GROUP_BY,STRICT_TRANS_TABLES,NO_ZERO_IN_DATE,NO_ZERO_DATE,ERROR_FOR_DIVISION_BY_ZERO,NO_ENGINE_SUBSTITUTION';

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
DROP SCHEMA IF EXISTS `mydb` ;

-- -----------------------------------------------------
-- Schema mydb
-- -----------------------------------------------------
CREATE SCHEMA IF NOT EXISTS `mydb` DEFAULT CHARACTER SET utf8 ;
USE `mydb` ;

-- -----------------------------------------------------
-- Table `mydb`.`Pais`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Pais` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Pais` (
  `idpais` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  PRIMARY KEY (`idpais`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Estado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Estado` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Estado` (
  `idestado` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `pais_idpais` INT NOT NULL,
  PRIMARY KEY (`idestado`),
  INDEX `fk_estado_país1_idx` (`pais_idpais` ASC) VISIBLE,
  CONSTRAINT `fk_estado_país1`
    FOREIGN KEY (`pais_idpais`)
    REFERENCES `mydb`.`Pais` (`idpais`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Municipio`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Municipio` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Municipio` (
  `idmunicipio` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(60) NOT NULL,
  `estado_idestado` INT NOT NULL,
  PRIMARY KEY (`idmunicipio`),
  INDEX `fk_municipio_estado1_idx` (`estado_idestado` ASC) VISIBLE,
  CONSTRAINT `fk_municipio_estado1`
    FOREIGN KEY (`estado_idestado`)
    REFERENCES `mydb`.`Estado` (`idestado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Direccion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Direccion` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Direccion` (
  `iddirección` INT NOT NULL AUTO_INCREMENT,
  `calle` VARCHAR(45) NOT NULL,
  `cp` VARCHAR(45) NOT NULL,
  `no. int` VARCHAR(45) NULL,
  `no. ext` VARCHAR(45) NOT NULL,
  `colonia` VARCHAR(45) NOT NULL,
  `municipio_idmunicipio` INT NOT NULL,
  PRIMARY KEY (`iddirección`),
  INDEX `fk_direccion_municipio1_idx` (`municipio_idmunicipio` ASC) VISIBLE,
  CONSTRAINT `fk_direccion_municipio1`
    FOREIGN KEY (`municipio_idmunicipio`)
    REFERENCES `mydb`.`Municipio` (`idmunicipio`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Usuario`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Usuario` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Usuario` (
  `idusuario` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `apellido materno` VARCHAR(45) NOT NULL,
  `apellido paterno` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(1024) NOT NULL,
  `telefono` VARCHAR(10) NOT NULL,
  `correo` VARCHAR(50) NOT NULL,
  PRIMARY KEY (`idusuario`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Empleado`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Empleado` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Empleado` (
  `idempleado` INT NOT NULL AUTO_INCREMENT,
  `nombre` VARCHAR(45) NOT NULL,
  `usuario` VARCHAR(45) NOT NULL,
  `contrasena` VARCHAR(1024) NOT NULL,
  PRIMARY KEY (`idempleado`))
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`Solicitud`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`Solicitud` ;

CREATE TABLE IF NOT EXISTS `mydb`.`Solicitud` (
  `idsolicitud` INT NOT NULL AUTO_INCREMENT,
  `monto` INT NOT NULL,
  `meses` INT NOT NULL,
  `interes` INT NOT NULL,
  `fecha_solicitud` DATETIME NOT NULL,
  `fecha_aprovado` DATETIME NOT NULL,
  `aprovado` BIT(1) NOT NULL,
  `empleado_idempleado` INT NOT NULL,
  PRIMARY KEY (`idsolicitud`),
  INDEX `fk_solicitud_empleado1_idx` (`empleado_idempleado` ASC) VISIBLE,
  CONSTRAINT `fk_solicitud_empleado1`
    FOREIGN KEY (`empleado_idempleado`)
    REFERENCES `mydb`.`Empleado` (`idempleado`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`usuario_solicitud`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`usuario_solicitud` ;

CREATE TABLE IF NOT EXISTS `mydb`.`usuario_solicitud` (
  `solicitud_idsolicitud` INT NOT NULL,
  `usuario_idusuario` INT NOT NULL,
  INDEX `fk_usuario_solicitud_solicitud_idx` (`solicitud_idsolicitud` ASC) VISIBLE,
  INDEX `fk_usuario_solicitud_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_solicitud_solicitud`
    FOREIGN KEY (`solicitud_idsolicitud`)
    REFERENCES `mydb`.`Solicitud` (`idsolicitud`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_solicitud_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `mydb`.`Usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


-- -----------------------------------------------------
-- Table `mydb`.`usuario_direccion`
-- -----------------------------------------------------
DROP TABLE IF EXISTS `mydb`.`usuario_direccion` ;

CREATE TABLE IF NOT EXISTS `mydb`.`usuario_direccion` (
  `usuario_idusuario` INT NOT NULL,
  `direccion_iddirección` INT NOT NULL,
  INDEX `fk_usuario_direccion_usuario1_idx` (`usuario_idusuario` ASC) VISIBLE,
  INDEX `fk_usuario_direccion_direccion1_idx` (`direccion_iddirección` ASC) VISIBLE,
  CONSTRAINT `fk_usuario_direccion_usuario1`
    FOREIGN KEY (`usuario_idusuario`)
    REFERENCES `mydb`.`Usuario` (`idusuario`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION,
  CONSTRAINT `fk_usuario_direccion_direccion1`
    FOREIGN KEY (`direccion_iddirección`)
    REFERENCES `mydb`.`Direccion` (`iddirección`)
    ON DELETE NO ACTION
    ON UPDATE NO ACTION)
ENGINE = InnoDB;


SET SQL_MODE=@OLD_SQL_MODE;
SET FOREIGN_KEY_CHECKS=@OLD_FOREIGN_KEY_CHECKS;
SET UNIQUE_CHECKS=@OLD_UNIQUE_CHECKS;