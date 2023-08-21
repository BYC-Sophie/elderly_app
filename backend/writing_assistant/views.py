from django.shortcuts import render
from django.http import JsonResponse, HttpResponse
from django.views.decorators.csrf import csrf_exempt
import openai
import json
import re

# Create your views here.

promptGeneration = """你是一个专注于老人写作的助手。你需要根据老人提供的信息提出问题，以此帮助老人回忆自己的经历和完善细节。最后你需要根据所有信息生成一篇文章。
请注意：
第一，每次问问题的个数只能为一个。不能将问题全部问出来，要一个问题一个问题问
第二，你的最后一个问题要允许老人自由补充细节
第三，问题不能太复杂，要关爱老人
第四，语气请缓和一些，要多鼓励老人去回忆和思考
第五，生成的文章应该符合老年人写作的风格"""

promptRegeneration = """你是一个专注于老人写作的助手。接下来你会收到一段文字和老人的修改想法，请依据老人的想法进行修改
"""

systemInitMessage = {"role": "system", "content": promptGeneration}

@csrf_exempt
def chatCompletion(request):
    if (request.method == "POST"):


        # print(request.body)
        jsonData = None
        jsonData = json.loads(request.body)

        try:
            
            chatHistory = jsonData["chatHistory"]
        except:
            # initBool = False
            # receivedText = "你好"
            return JsonResponse({"error": "Bool or string data not found."})

        # print(chatHistory) # chatHistory in the form of {"text": text, "isUser": bool}

        # messages should be in the form of {"role": role, "content": text}
        messages = [{"role": "user" if el['isUser'] else "assistant", "content": el["text"]} for el in chatHistory]

        # change the message at index 0 to the system role message
        messages[0] = systemInitMessage

        
        print(messages)

        # return JsonResponse(botResponseMessage)

        # Get chatCompletion response from openai
        if(not messages):
            return JsonResponse({"error": "No chat data provided."})
        try:
            
            chatResponse = openai.ChatCompletion.create(
                model = "gpt-3.5-turbo-16k",
                messages = messages,
                temperature=1,
                max_tokens=1024,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )
            responseText = chatResponse['choices'][0]['message']['content']


            print(responseText)
            
            botResponseMessage = {"text": responseText}
            
            return JsonResponse(botResponseMessage)
        except openai.InvalidRequestError as e:
            return JsonResponse({"error": "Error during making chat completion: {}".format(e)})

            
    else:
        return JsonResponse({"error": "Invalid Request Method."})
    

@csrf_exempt
def regenerate(request):
    if (request.method == "POST"):


        print(request.body)
        jsonData = None
        jsonData = json.loads(request.body)
        print(jsonData)
        try:
            originalText = jsonData['text']
            instruction = jsonData["instruction"]
        except:
            # initBool = False
            # receivedText = "你好"
            print("DATA NOT FOUND.")
            return JsonResponse({"error": "text or instruction data not found."})

        messages = [
            {"role": "system", "content": promptRegeneration},
            {"role": "user", "content": "文章内容：{}, 修改想法：{}".format(originalText, instruction)}
        ]

        print(messages)
        try:
            chatResponse  = openai.ChatCompletion.create(
                model = "gpt-3.5-turbo-16k",
                messages=messages,
                temperature=1,
                max_tokens=1024,
                top_p=1,
                frequency_penalty=0,
                presence_penalty=0
            )

            responseText = chatResponse['choices'][0]['message']['content']

            print(responseText)
                
            regeneratedTextResponse = {"text": responseText}

            return JsonResponse(regeneratedTextResponse)
        except openai.InvalidRequestError as e:
            return JsonResponse({"error": "Error during making chat completion: {}".format(e)})
    else:
        return JsonResponse({"error": "Invalid Request Method."})
    