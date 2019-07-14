import requests
import json
from time import sleep
from picamera import PiCamera
import RPi.GPIO as GPIO
from subprocess import call
import os

# Global variables
GPIO.setwarnings(False)
GPIO.setmode(GPIO.BCM)
GPIO.setup(23, GPIO.IN)  # PIR
GPIO.setup(24, GPIO.OUT)  # LED
GPIO.output(24, False)

# Randomly generated URL to cast HTTP requests to remote web server
API_URL = 'https://6132065e.ngrok.io'
camera = PiCamera()


def sensorVideo():
	print ("Booting the Camera")
	while True:
		# Check if PIR has detected motion
		if GPIO.input(23):
			# Turn on LED
			GPIO.output(24, True)
			camera.start_preview()
			# Initialize the camera
			sleep(2)
			# Take a 5 second video
			camera.start_recording('video.h264')
			camera.wait_recording(5)
			camera.stop_recording()
			camera.stop_preview()
			# Convert the .h264 video file to a .mp4 file
			command = "MP4Box -add video.h264 video.mp4"
			try:
				call([command], shell=True)
				# Video converted successfully
				url = API_URL + '/insert'
				files = {'media': ('video.mp4', open('video.mp4', 'rb'))}
				# Send video file to remote web server
				r = requests.post(url, files=files)
				if r.status_code == 200:
					# Video sent to server successfully
					try:
						# Remove the .mp4 file from directory
						os.remove('video.mp4')
					except Exception as error:
						# Could not remove .mp4 file
						print (error)
						break
					print("Uploaded to webpage!")
				else:
					print ("Request Error")
					break
				# Turn off LED
				GPIO.output(24, False)
				# Delay for 2 seconds
				sleep(2)
			except Exception as error:
				# Could not convert video to .mp4
				print (error)
				break
		# Allow for PIR to reset
		sleep(0.1)
	exit(0)


if __name__ == "__main__":
    	sensorVideo()
