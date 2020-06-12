--
-- PostgreSQL database dump
--

-- Dumped from database version 12.3
-- Dumped by pg_dump version 12.3

-- Started on 2020-06-12 12:20:59

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

DROP DATABASE typoteka;
--
-- TOC entry 2870 (class 1262 OID 16828)
-- Name: typoteka; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE typoteka WITH TEMPLATE = template0 ENCODING = 'UTF8' LC_COLLATE = 'C' LC_CTYPE = 'C';


ALTER DATABASE typoteka OWNER TO postgres;

\connect typoteka

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_table_access_method = heap;

--
-- TOC entry 205 (class 1259 OID 16844)
-- Name: articles; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles (
    id bigint NOT NULL,
    title character varying(250) NOT NULL,
    announce character varying(250) NOT NULL,
    full_text character varying(1000),
    picture character varying(100),
    created_date date NOT NULL,
    user_id bigint NOT NULL
);


ALTER TABLE public.articles OWNER TO postgres;

--
-- TOC entry 208 (class 1259 OID 16876)
-- Name: articles_categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.articles_categories (
    article_id bigint NOT NULL,
    category_id bigint NOT NULL
);


ALTER TABLE public.articles_categories OWNER TO postgres;

--
-- TOC entry 204 (class 1259 OID 16842)
-- Name: articles_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.articles_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.articles_id_seq OWNER TO postgres;

--
-- TOC entry 2871 (class 0 OID 0)
-- Dependencies: 204
-- Name: articles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.articles_id_seq OWNED BY public.articles.id;


--
-- TOC entry 207 (class 1259 OID 16861)
-- Name: categories; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.categories (
    id bigint NOT NULL,
    title character varying(30) NOT NULL
);


ALTER TABLE public.categories OWNER TO postgres;

--
-- TOC entry 206 (class 1259 OID 16859)
-- Name: categories_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.categories_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.categories_id_seq OWNER TO postgres;

--
-- TOC entry 2872 (class 0 OID 0)
-- Dependencies: 206
-- Name: categories_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.categories_id_seq OWNED BY public.categories.id;


--
-- TOC entry 210 (class 1259 OID 16895)
-- Name: comments; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.comments (
    id bigint NOT NULL,
    text character varying(100) NOT NULL,
    created_date date NOT NULL,
    user_id bigint NOT NULL,
    article_id bigint NOT NULL
);


ALTER TABLE public.comments OWNER TO postgres;

--
-- TOC entry 209 (class 1259 OID 16893)
-- Name: comments_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.comments_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.comments_id_seq OWNER TO postgres;

--
-- TOC entry 2873 (class 0 OID 0)
-- Dependencies: 209
-- Name: comments_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.comments_id_seq OWNED BY public.comments.id;


--
-- TOC entry 203 (class 1259 OID 16831)
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    id bigint NOT NULL,
    firstname character varying(100) NOT NULL,
    lastname character varying(100) NOT NULL,
    email character varying(100) NOT NULL,
    password character varying(100) NOT NULL,
    avatar character varying(100) NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- TOC entry 202 (class 1259 OID 16829)
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_id_seq
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_id_seq OWNER TO postgres;

--
-- TOC entry 2874 (class 0 OID 0)
-- Dependencies: 202
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- TOC entry 2712 (class 2604 OID 16847)
-- Name: articles id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles ALTER COLUMN id SET DEFAULT nextval('public.articles_id_seq'::regclass);


--
-- TOC entry 2713 (class 2604 OID 16864)
-- Name: categories id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories ALTER COLUMN id SET DEFAULT nextval('public.categories_id_seq'::regclass);


--
-- TOC entry 2714 (class 2604 OID 16898)
-- Name: comments id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments ALTER COLUMN id SET DEFAULT nextval('public.comments_id_seq'::regclass);


--
-- TOC entry 2711 (class 2604 OID 16834)
-- Name: users id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- TOC entry 2729 (class 2606 OID 16880)
-- Name: articles_categories articles_categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT articles_categories_pkey PRIMARY KEY (article_id, category_id);


--
-- TOC entry 2720 (class 2606 OID 16852)
-- Name: articles articles_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_pkey PRIMARY KEY (id);


--
-- TOC entry 2723 (class 2606 OID 16866)
-- Name: categories categories_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT categories_pkey PRIMARY KEY (id);


--
-- TOC entry 2725 (class 2606 OID 16870)
-- Name: categories category_title; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.categories
    ADD CONSTRAINT category_title UNIQUE (title);


--
-- TOC entry 2732 (class 2606 OID 16900)
-- Name: comments comments_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_pkey PRIMARY KEY (id);


--
-- TOC entry 2716 (class 2606 OID 16841)
-- Name: users user_email; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT user_email UNIQUE (email);


--
-- TOC entry 2718 (class 2606 OID 16839)
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- TOC entry 2726 (class 1259 OID 16891)
-- Name: articles_categories_article_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX articles_categories_article_id_idx ON public.articles_categories USING btree (article_id);


--
-- TOC entry 2727 (class 1259 OID 16892)
-- Name: articles_categories_category_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX articles_categories_category_id_idx ON public.articles_categories USING btree (category_id);


--
-- TOC entry 2721 (class 1259 OID 16858)
-- Name: articles_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX articles_user_id_idx ON public.articles USING btree (user_id);


--
-- TOC entry 2730 (class 1259 OID 16911)
-- Name: comments_article_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_article_id_idx ON public.comments USING btree (article_id);


--
-- TOC entry 2733 (class 1259 OID 16912)
-- Name: comments_user_id_idx; Type: INDEX; Schema: public; Owner: postgres
--

CREATE INDEX comments_user_id_idx ON public.comments USING btree (user_id);


--
-- TOC entry 2735 (class 2606 OID 16881)
-- Name: articles_categories articles_categories_articles; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT articles_categories_articles FOREIGN KEY (article_id) REFERENCES public.articles(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2736 (class 2606 OID 16886)
-- Name: articles_categories articles_categories_categories; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles_categories
    ADD CONSTRAINT articles_categories_categories FOREIGN KEY (category_id) REFERENCES public.categories(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2734 (class 2606 OID 16853)
-- Name: articles articles_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.articles
    ADD CONSTRAINT articles_users FOREIGN KEY (user_id) REFERENCES public.users(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2738 (class 2606 OID 16906)
-- Name: comments comments_articles; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_articles FOREIGN KEY (article_id) REFERENCES public.articles(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


--
-- TOC entry 2737 (class 2606 OID 16901)
-- Name: comments comments_users; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.comments
    ADD CONSTRAINT comments_users FOREIGN KEY (user_id) REFERENCES public.users(id) MATCH FULL ON UPDATE CASCADE ON DELETE CASCADE;


-- Completed on 2020-06-12 12:20:59

--
-- PostgreSQL database dump complete
--

