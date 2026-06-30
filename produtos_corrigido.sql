--
-- PostgreSQL database dump
--

-- Dumped from database version 17.0
-- Dumped by pg_dump version 17.0

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: produtos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.produtos (
    id integer NOT NULL,
    nome character varying(255) NOT NULL,
    descricao character varying(255) NOT NULL,
    preco numeric(10,2) NOT NULL,
    categoria character varying(255) NOT NULL,
    thumbnail_url character varying(255),
    created_at timestamp with time zone,
    updated_at timestamp with time zone
);


ALTER TABLE public.produtos OWNER TO postgres;

--
-- Name: produtos_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.produtos_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.produtos_id_seq OWNER TO postgres;

--
-- Name: produtos_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.produtos_id_seq OWNED BY public.produtos.id;


--
-- Name: produtos id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos ALTER COLUMN id SET DEFAULT nextval('public.produtos_id_seq'::regclass);


--
-- Data for Name: produtos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.produtos (id, nome, descricao, preco, categoria, thumbnail_url, created_at, updated_at) FROM stdin;
15	Casquinhas dos meninos	4 casquinhas deliciosas de sabores variados.	12.00	Sobremesas	thumbnailUrl/produtos-15/13.jpg	2025-05-08 11:01:40.897-03	2025-05-08 11:02:11.245-03
17	Profiteroles do chef 	Sobremesa do chef profiteroles com especiarias	16.00	Sobremesas	thumbnailUrl/produtos-17/15.jpg	2025-05-08 11:05:39.907-03	2025-05-08 11:05:39.999-03
18	Nhoque com fil├®  mignon	Nhoque bolonhesa com massa fresca e carne nobre.	24.00	Pratos	thumbnailUrl/produtos-18/12.jpg	2025-05-08 11:07:50.612-03	2025-05-08 11:07:50.699-03
19	Risoto de camar├úo	Risoto com queij├úo parmes├úo faixa azul e camar├úo-carabineiro	33.00	Pratos	thumbnailUrl/produtos-19/5.jpg	2025-05-08 11:09:41.962-03	2025-05-08 11:09:42.058-03
20	Polvo gratinado	Polvo gratinado com um pur├¬ de ab├│bora com vinho branco e especiarias	14.00	Entradas	thumbnailUrl/produtos-20/11.jpg	2025-05-08 11:11:19.337-03	2025-05-08 11:11:19.434-03
21	Risoto de funghi	Risoto com queijo parmes├úo, cogumelos funghi e vinho branco	33.00	Pratos	thumbnailUrl/produtos-21/6.jpg	2025-05-08 11:13:57.752-03	2025-05-08 11:13:57.845-03
22	Penne ao molho branco	Massa fresca, molho  com vinho branco e espeiciarias	30.00	Pratos	thumbnailUrl/produtos-22/7.jpg	2025-05-08 11:16:25.688-03	2025-05-08 11:16:25.777-03
23	Sorvete	Sorvete artesanal feito pelo chef sabor chocolate com creme 	18.00	Sobremesas	thumbnailUrl/produtos-23/14.jpg	2025-05-08 11:21:07.222-03	2025-05-08 11:21:07.308-03
24	Fil├® mignon com batatas	Corte nobre com batata fresca e especiarias do chef	38.00	Pratos	thumbnailUrl/produtos-24/8.jpg	2025-05-08 11:22:49.044-03	2025-05-08 11:22:49.136-03
25	Camar├úo empanado	Camar├úo sete barbas limpo sem calda empanado e frito	25.00	Entradas	thumbnailUrl/produtos-25/9.jpg	2025-05-08 11:24:40.256-03	2025-05-08 11:24:40.348-03
26	Carpaccio	Carpaccio de Atum com cream cheese e espiciarias do chef	16.00	Entrada	thumbnailUrl/produtos-26/3.jpg	2025-05-08 11:25:47.265-03	2025-05-08 11:25:47.355-03
1	cerveja	stella	12.00	Bebidas	thumbnailUrl/produtos-1/1.png	2025-05-05 11:07:52.492-03	2025-05-06 11:27:05.691-03
2	Lagosta	Lagosta inteira cozida com especiarias	12.00	Pratos	thumbnailUrl/produtos-2/7.png	2025-05-05 11:53:09.769-03	2025-05-06 11:27:40.083-03
27	Parma simples	Cama de alface com presunto parma e especiarias	14.00	Entrada	thumbnailUrl/produtos-27/1.jpg	2025-05-08 11:27:28.721-03	2025-05-08 11:27:28.811-03
4	Ostras 	Por├º├úo de ostras frescas	16.00	Entradas	thumbnailUrl/produtos-4/6.png	2025-05-05 17:35:08.403-03	2025-05-06 11:28:44.209-03
6	Cerveja	Heineken 600ml	20.00	Bebidas	thumbnailUrl/produtos-6/3.png	2025-05-05 17:37:54.202-03	2025-05-06 11:29:07.332-03
7	Brusqueta	Brusqueta com toque especial do chef renomado da regi├úo.	10.00	Entradas	thumbnailUrl/produtos-7/5.png	2025-05-05 17:39:26.992-03	2025-05-06 11:29:22.674-03
3	Tartar	Tartar de carne nobre vermelha	14.00	Entrada	thumbnailUrl/produtos-3/4.png	2025-05-05 16:46:35.737-03	2025-05-06 11:29:44.768-03
8	Macarr├úo Carbonara	Carborana feito com toque especial do chef italiano renomado.	20.00	Pratos	thumbnailUrl/produtos-8/2.png	2025-05-05 17:41:07.633-03	2025-05-06 11:30:00.651-03
5	Vieiras	Vieiras frescas com especiarias	18.00	Entradas	thumbnailUrl/produtos-5/8.png	2025-05-05 17:36:18.786-03	2025-05-06 11:52:54.357-03
10	Tequila dos casais	Dois shots de Tequila com lim├úo e sal	16.00	Bebidas	thumbnailUrl/produtos-10/3.jpg	2025-05-08 09:49:51.147-03	2025-05-08 09:49:51.265-03
11	Caipirinha	Caipirinha de lim├úo com velho barreiro	12.00	Bebidas	thumbnailUrl/produtos-11/4.jpg	2025-05-08 09:50:36.558-03	2025-05-08 09:50:36.649-03
12	Suco de laranja	Suco de laranja natural feito na hora com laranja lima	14.00	Bebidas	thumbnailUrl/produtos-12/1.jpg	2025-05-08 09:51:33.885-03	2025-05-08 09:51:33.98-03
14	Agua	Agua mineral da fonte de Lindoya	8.00	Bebidas	thumbnailUrl/produtos-14/5.jpg	2025-05-08 09:53:03.292-03	2025-05-08 09:53:03.387-03
28	Ceviche	Ceviche de salm├úo com camar├úo sete barbas e especiarias	16.00	Entradas	thumbnailUrl/produtos-28/4.jpg	2025-05-08 11:28:27.625-03	2025-05-08 11:28:27.819-03
29	Batata da casa	Batata fresca preparada pelo chef com farofa de bacon	14.00	Entradas	thumbnailUrl/produtos-29/2.jpg	2025-05-08 11:29:46.337-03	2025-05-08 11:29:46.427-03
16	Brownie	Brownie de chocolate 100% cacau	14.00	Sobremesas	thumbnailUrl/produtos-16/16.jpg	2025-05-08 11:03:03.181-03	2025-05-23 10:24:42.538-03
13	Suco de melancia	Suco de melancia natural feito na hora com melancia de minas	16.00	Bebidas	thumbnailUrl/produtos-13/2.jpg	2025-05-08 09:52:17.852-03	2025-08-05 16:09:37.452-03
\.


--
-- Name: produtos_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.produtos_id_seq', 29, true);


--
-- Name: produtos produtos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.produtos
    ADD CONSTRAINT produtos_pkey PRIMARY KEY (id);


--
-- PostgreSQL database dump complete
--

